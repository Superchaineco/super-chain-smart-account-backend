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
    badgesToPerk: { badgeId: number; level: number; points: number }[];
}

interface PerkData {
    badgeId: number;
    tier: number;
}

interface PerkJobData {
    account: string;
    perks: PerkData[];
}
export class AttestQueueService {
    private readonly queueName = 'attestQueue';
    private readonly perkQueueName = 'perkQueue';
    public readonly queue: Queue<AttestJobData>;
    public readonly perkQueue: Queue<PerkJobData>;
    private readonly BATCH_SIZE = 50;
    private resultMap = new Map<string, any>();
    private perkResultMap = new Map<string, any>();
    private isRunning: boolean = false;
    constructor() {
        this.queue = new Queue(this.queueName, {
            connection: redisWorker,
        });
        this.perkQueue = new Queue(this.perkQueueName, {
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


            const data =   jobs.map((job) => ({
                account: job.data.account,
                totalPoints: job.data.totalPoints,
                badges: job.data.badges,
                badgeUpdates: job.data.badgeUpdates,
                badgesToPerk: job.data.badgesToPerk,
            }))
            await this.enqueuePerks(data);
            await this.processPerkQueue();
            const results = await service.batchAttest(data);
            console.log(`[Polling] Executed! ${jobs.length} attestations`);
     
            for (const r of results) {
                this.resultMap.set(r.account.toLowerCase(), r);
            }


            this.isRunning = false;
        } catch (error) {
            console.error('[Polling Batch Error]', error);

            for (const j of jobs) {
                this.resultMap.set(j.data.account.toLowerCase(), { message: "Error" });
            }
        } finally {
            await Promise.all(
                jobs.map(async (job) => {
                    await job.remove()
                })
            );
            this.isRunning = false;
        }
    }

    public async queueAndWait(data: AttestJobData, isHuman: boolean): Promise<unknown> {
        const jobId = `attest-${data.account}`;
        console.log('🧑‍⚖️ Job ID:', jobId);

        const existing = await this.queue.getJob(jobId);
        const isDone = await existing?.isCompleted() ?? false;
        const isFailed = await existing?.isFailed() ?? false;

        if (existing && (isDone || isFailed) || !existing) {
            await existing?.remove()
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



    private async enqueuePerks(data: AttestJobData[]) {

        if (data.length === 0) {
            console.log('[Perk Queue] No data to enqueue');
            return;
        }

        console.log(`[Perk Queue] Enqueuing perks for ${data.length} accounts`);


        for (const d of data) {
            if (!d.badgesToPerk || d.badgesToPerk.length === 0) {
                console.log(`[Perk Queue] No badge updates for ${d.account}, skipping perks`);
                continue;
            }
            const jobId = `perk-${d.account}`;

            const existing = await this.perkQueue.getJob(jobId);
            const isDone = await existing?.isCompleted() ?? false;
            const isFailed = await existing?.isFailed() ?? false;

            if (existing && (isDone || isFailed) || !existing) {
                const perks = d.badgesToPerk.map((d) => ({
                    badgeId: d.badgeId,
                    tier: d.level,
                }));

                if (perks.length === 0) {
                    console.log(`[Perk Queue] No valid perks for ${d.account}, skipping`);
                    continue;
                }

                const jobData: PerkJobData = {
                    account: d.account,
                    perks: perks,
                };
                try {
                    await existing?.remove();
                    await this.perkQueue.add(this.perkQueueName, jobData, {
                        jobId,
                        attempts: 1,
                        priority: 1,
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
                    console.log(`[Perk Queue] Enqueued ${perks.length} perks for ${d.account}`);
                } catch (error) {
                    console.error(`[Perk Queue] Error enqueuing perks for ${d.account}:`, error);
                }
            }
            else {
                console.log(`🎁 Perk job already exists and is active for ${d.account}`);
            }
        }


    }

    private async processPerkQueue() {
        const jobs = await this.perkQueue.getJobs(['prioritized', 'waiting'], 0, this.BATCH_SIZE - 1);
        if (jobs.length === 0) {
            console.log(`[Perk Polling] Nothing to process.....`);
            return;
        }
        console.log(`[Perk Polling] Processing ${jobs.length} perk redemptions`);

        try {
            const { PerkService } = await import('@/services/badges/perk.service');
            const perkService = new PerkService();

            const results = await Promise.all(
                jobs.map(async (job) => {
                    try {
                        const result = await perkService.redeemPerk(
                            job.data.perks,
                            job.data.account
                        );
                        return {
                            account: job.data.account,
                            perkHash: result,
                            perkSuccess: typeof result === 'string',
                            perks: job.data.perks
                        };
                    } catch (error) {
                        console.error(`Error processing perk for ${job.data.account}:`, error);
                        return {
                            account: job.data.account,
                            perkHash: null,
                            perkSuccess: false,
                            error: error.message,
                            perks: job.data.perks
                        };
                    }
                })
            );
            console.log(`[Perk Polling] Executed! ${jobs.length} perk redemptions`);
            for (const r of results) {
                this.perkResultMap.set(r.account.toLowerCase(), r);
            }

        } catch (error) {
            console.error('[Perk Polling Batch Error]', error);
        } finally {
            await Promise.all(jobs.map(async (job) => await job.remove()));
        }
    }
}

export const attestQueueService = new AttestQueueService();
