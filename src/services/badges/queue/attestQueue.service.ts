import { Job, Queue, QueueEvents, Worker } from 'bullmq';
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

type JobWithToken = { job: Job<AttestJobData>; token: string };

export class AttestQueueService {
    private readonly queueName = 'attestQueue';
    public readonly queue: Queue<AttestJobData>;
    private readonly queueEvents: QueueEvents;
    private readonly worker?: Worker<AttestJobData>;

    private batchBuffer: JobWithToken[] = [];
    private batchTimer: NodeJS.Timeout | null = null;
    private readonly BATCH_SIZE = 50;
    private readonly BATCH_TIMEOUT_MS = 10000;
    private isBatching = false;

    constructor() {
        this.queue = new Queue(this.queueName, {
            connection: redisWorker,
        });

        this.queueEvents = new QueueEvents(this.queueName, {
            connection: redisWorker,
        });

        if (ENV === ENVIRONMENTS.production) {
            this.worker = new Worker(
                this.queueName,
                async (job, token) => {
                    this.batchBuffer.push({ job, token });

                    if (!this.batchTimer) {
                        this.batchTimer = setTimeout(() => {
                            this.executeBatch();
                        }, this.BATCH_TIMEOUT_MS);
                    }

                    if (this.batchBuffer.length >= this.BATCH_SIZE) {
                        clearTimeout(this.batchTimer!);
                        this.batchTimer = null;
                        await this.executeBatch();
                    }
                },
                {
                    concurrency: 1,
                    connection: redisWorker,
                }
            );

            this.worker.on('error', (err) => {
                console.error('[Attest Worker Error]', err);
            });
        }
    }

    private async executeBatch() {
        if (this.isBatching || this.batchBuffer.length === 0) return;
        this.isBatching = true;

        const jobsWithTokens = [...this.batchBuffer];
        this.batchBuffer = [];
        this.batchTimer = null;

        const service = new AttestationsService();

        try {
            console.log(`[Batching] Executing ${jobsWithTokens.length} attestations`);
            await service.batchAttest(
                jobsWithTokens.map(({ job }) => ({
                    account: job.data.account,
                    totalPoints: job.data.totalPoints,
                    badges: job.data.badges,
                    badgeUpdates: job.data.badgeUpdates,
                }))
            );

            for (const { job, token } of jobsWithTokens) {
                await job.updateProgress(100);
                await job.moveToCompleted('done', token, true);
            }
        } catch (error) {
            console.error('[Batching Error]', error);
            for (const { job } of jobsWithTokens) {
                await job.moveToDelayed(Date.now() + 5000);
            }
        }

        this.isBatching = false;
    }

    public async queueAndWait(data: AttestJobData): Promise<any> {
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
        }

        const job = await this.queue.add(this.queueName, data, {
            jobId,
            attempts: 1,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: {
                age: 3600,
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
