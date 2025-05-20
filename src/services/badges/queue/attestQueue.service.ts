
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

export class AttestQueueService {
    private readonly queueName = 'attestQueue';
    public readonly queue: Queue<AttestJobData>;
    private readonly queueEvents: QueueEvents;
    private readonly worker?: Worker<AttestJobData>;

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
                async (job) => {
                    const { account, totalPoints, badges, badgeUpdates } = job.data;
                    const service = new AttestationsService();
                    console.log('Executing attestation ', account);
                    return await service.attest(account, totalPoints, badges, badgeUpdates);
                },
                {
                    concurrency: 1, // garantizamos ejecución única
                    connection: redisWorker,
                }
            );

            this.worker.on('error', (err) => {
                console.error('[Attest Worker Error]', err);
            });
        }
    }

    public async queueAndWait(data: AttestJobData, isHuman: boolean): Promise<any> {
        const jobId = `attest-${data.account}`;
        console.log('🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️Job ID:', jobId);
        const existing = await this.queue.getJob(jobId);
        if (
            existing &&
            !(await existing.isCompleted()) &&
            !(await existing.isFailed())
        ) {
            await existing.remove();
        }

        const job = await this.queue.add(this.queueName, data, {
            priority: isHuman ? 1 : 2,
            jobId,
            attempts: 3,
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
        console.log('🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️🧑‍⚖️Waiting...', jobId);

        return await job.waitUntilFinished(this.queueEvents);
    }
}
export const attestQueueService = new AttestQueueService();