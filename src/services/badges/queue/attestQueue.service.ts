// Este nuevo enfoque elimina el Worker de BullMQ y procesa los jobs manualmente cada 10 segundos
import { Job, Queue, QueueEvents } from 'bullmq';
import { redisWorker } from '@/utils/cache';
import { ENV, ENVIRONMENTS } from '@/config/superChain/constants';
import { AttestationsService } from '@/services/attestations.service';
import { ResponseBadge } from '../badges.service';

interface AttestJobData {
    account: string;
    totalPoints: number;
    badges: ResponseBadge[];
    badgeUpdates: { badgeId: number; level: number; points: number }[];
}

export class AttestQueueService {
    private readonly queueName = 'attestQueue';
    public readonly queue: Queue<AttestJobData>;
    private readonly BATCH_SIZE = 50;
    private resultMap = new Map<string, any>();
    private isRunning: boolean = false;
    constructor() {
        this.queue = new Queue(this.queueName, {
            connection: redisWorker,
        });



        if (ENV !== ENVIRONMENTS.development) {
            setInterval(() => this.pollAndProcess(), 5000);
        }
    }

    private async pollAndProcess() {
        console.log(`Entered pooling is running?`, this.isRunning);
        if (this.isRunning) return;
        this.isRunning = true;
        console.log(`[Polling] Processing.....`);
        const jobs = await this.queue.getJobs(['prioritized', 'waiting'], 0, this.BATCH_SIZE - 1);
        if (jobs.length === 0) {
            console.log(`[Polling] Nothing to process.....`);
            this.isRunning = false;
            return;
        }
        console.log(`[Polling] Processing ${jobs.length} attestations`);
        try {

            for (const j of jobs) {
                this.resultMap.delete(j.data.account.toLowerCase());
            }

            const service = new AttestationsService();


            const results = await service.batchAttest(
                jobs.map((job) => ({
                    account: job.data.account,
                    totalPoints: job.data.totalPoints,
                    badges: job.data.badges,
                    badgeUpdates: job.data.badgeUpdates,
                }))
            );
            console.log(`[Polling] Executed! ${jobs.length} attestations`);

            for (const r of results) {
                this.resultMap.set(r.account.toLowerCase(), r);
            }

            await Promise.all(
                jobs.map(async (job) => {
                    await job.remove()
                })
            );
            this.isRunning = false;
        } catch (error) {
            console.error('[Polling Batch Error]', error);
        } finally {
            this.isRunning = false;
        }
    }

    public async queueAndWait(data: AttestJobData, isHuman: boolean): Promise<unknown> {
        const jobId = `attest-${data.account}`;
        console.log('🧑‍⚖️ Job ID:', jobId);

        const existing = await this.queue.getJob(jobId);
        if (existing) {
            const isDone = await existing.isCompleted();
            const isFailed = await existing.isFailed();
            if (!isDone && !isFailed) {
                console.log('⏳ Job already pending, skipping enqueue.');
            } else {
                await existing.remove()
                await this.queue.add(this.queueName, data, {
                    jobId,
                    attempts: 1,
                    priority: isHuman ? 1 : 2,
                    backoff: {
                        type: 'exponential',
                        delay: 1000,
                    },
                    removeOnComplete: {
                        age: 86400,
                    },
                    removeOnFail: {
                        age: 86400,
                    },
                });
            }

        }
        console.log('🧑‍⚖️ Waiting...', jobId);
        while (true) {
            const result = this.resultMap.get(data.account.toLowerCase());
            if (result) {
                console.log('🧑‍⚖️ Result found:', result);
                this.resultMap.delete(data.account.toLowerCase());
                return result;
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

    }
}

export const attestQueueService = new AttestQueueService();
