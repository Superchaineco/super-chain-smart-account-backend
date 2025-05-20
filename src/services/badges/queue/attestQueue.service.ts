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
    private readonly queueEvents: QueueEvents;
    private readonly BATCH_SIZE = 50;

    constructor() {
        this.queue = new Queue(this.queueName, {
            connection: redisWorker,
        });

        this.queueEvents = new QueueEvents(this.queueName, {
            connection: redisWorker,
        });

        if (ENV !== ENVIRONMENTS.development) {
            setInterval(() => this.pollAndProcess().catch(console.error), 10000);
        }
    }

    private async pollAndProcess() {
        
        const jobs = await this.queue.getJobs(['prioritized', 'waiting'], 0, this.BATCH_SIZE - 1);
        if (jobs.length === 0) return;

        const service = new AttestationsService();

        try {
            console.log(`[Polling] Processing ${jobs.length} attestations`);

            const results = await service.batchAttest(
                jobs.map((job) => ({
                    account: job.data.account,
                    totalPoints: job.data.totalPoints,
                    badges: job.data.badges,
                    badgeUpdates: job.data.badgeUpdates,
                }))
            );
            console.log(`[Polling] Executed! ${jobs.length} attestations`);
            const resultMap = new Map<string, any>();
            for (const r of results) {
                resultMap.set(r.account.toLowerCase(), r);
            }

            await Promise.all(
                jobs.map(async (job) => {
                    const result = resultMap.get(job.data.account.toLowerCase()) ?? null;
                    await job.updateProgress(100);
                    await job.moveToCompleted(result, job.token!, true);
                })
            );
        } catch (error) {
            console.error('[Polling Batch Error]', error);
            await Promise.all(
                jobs.map(async (job) => {
                    await job.moveToDelayed(Date.now() + 5000, job.token!);
                })
            );
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
                return {};
            }
            existing.remove()
        }

        const job = await this.queue.add(this.queueName, data, {
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

        console.log('🧑‍⚖️ Waiting...', jobId);
        return await job.waitUntilFinished(this.queueEvents);
    }
}

export const attestQueueService = new AttestQueueService();
