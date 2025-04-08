import { redis, redisWorker } from '@/utils/cache';
import { Queue, Worker, Job } from 'bullmq';
import { BadgesServices } from '../badges.service';
import { redisService } from '@/services/redis.service';
import { SuperChainAccountService } from '@/services/superChainAccount.service';

interface BadgeJobData {
  address: string;
  forceCompare: boolean;
}

export class BadgesQueueService {
  private readonly queue: Queue;
  private readonly worker: Worker;
  private readonly queueName = 'badgesQueue';
  private readonly badgesService: BadgesServices;
  private readonly superChainAccountService: SuperChainAccountService;

  constructor() {
    this.queue = new Queue(this.queueName, { connection: redis });
    this.badgesService = new BadgesServices(this);
    this.superChainAccountService = new SuperChainAccountService();
    this.worker = this.initializeWorker();
    this.attachLifecycleHandlers();
  }

  private initializeWorker(): Worker {
    return new Worker(
      this.queueName,
      async (job: Job<BadgeJobData>) => this.processJob(job),
      { connection: redisWorker }
    );
  }

  private async processJob(job: Job<BadgeJobData>): Promise<void> {
    const { address, forceCompare } = job.data;
    console.info(`Processing badge for address: ${address}`);

    if (forceCompare) {
      return await this.handleForceCompare(address);
    }

    return await this.fetchAndCacheBadges(address);
  }

  private async handleForceCompare(address: string): Promise<void> {
    const cacheKey = this.getCacheKey(address);
    const optimisticCacheKey = this.getOptimisticCacheKey(address);

    const [optimisticData, cachedData] = await Promise.all([
      redisService.getCachedData(optimisticCacheKey),
      redisService.getCachedData(cacheKey),
    ]);

    if (!optimisticData || !cachedData) {
      await this.fetchAndCacheBadges(address);
      return;
    }

    console.log(
      'Optimistic data found for badges. Returning optimistic data...'
    );

    try {
      const freshData = await this.fetchAndCacheBadges(address);

      if (JSON.stringify(freshData) !== JSON.stringify(cachedData)) {
        console.log(
          'Data fetch differs from optimistic data. Updating main cache and clearing optimistic data.'
        );
        await Promise.all([
          redisService.deleteCachedData(optimisticCacheKey),
          redisService.setCachedData(cacheKey, freshData, null),
        ]);
      } else {
        console.log(
          'Data fetch matches optimistic data. Everything remains the same.'
        );
      }
      return freshData;
    } catch (error) {
      console.error(
        'Error in badges fetch during comparison with optimistic data:',
        error
      );
      return null;
    }
  }

  private async fetchAndCacheBadges(address: string): Promise<any> {
    const cacheKey = this.getCacheKey(address);
    const eoas = await this.superChainAccountService.getEOAS(address);
    const freshData = await this.badgesService.getBadges(eoas, address);
    await redisService.setCachedData(cacheKey, freshData, null);
    return freshData;
  }

  private getCacheKey(address: string): string {
    return `${this.badgesService.BADGES_CACHE_KEY_PREFIX}:${address}`;
  }

  private getOptimisticCacheKey(address: string): string {
    return `${this.badgesService.OPTIMISTIC_UPDATED_BADGES_CACHE_KEY_PREFIX}:${address}`;
  }

  public async addJob(
    address: string,
    forceCompare: boolean = false
  ): Promise<void> {
    console.log('🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥');

    const existingJob = await this.queue.getJob(address);
    if (
      !existingJob ||
      (await existingJob.isCompleted()) ||
      (await existingJob.isFailed())
    ) {
      await this.queue.remove(address);
      await this.queue.add(this.queueName, { address }, { jobId: address, delay: 1000 });
    }
  }

  private attachLifecycleHandlers() {
    this.worker.on('error', (err) => {
      console.error('[BullMQ Worker Error]', err);
    });

    this.queue.on('error', (err) => {
      console.error('[BullMQ Queue Error]', err);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}, closing worker gracefully...`);
      await this.worker.close();
      process.exit(0);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  }
}

export const badgesQueueService = new BadgesQueueService();
