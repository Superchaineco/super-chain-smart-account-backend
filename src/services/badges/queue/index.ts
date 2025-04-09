import { redis, redisWorker } from '@/utils/cache';
import { Queue, Worker, Job } from 'bullmq';
import { redisService } from '@/services/redis.service';
import { ENV, ENVIRONMENTS } from '@/config/superChain/constants';
import axios from 'axios';

interface BadgeJobData {
  urlGet: string;
}


export class BadgesQueueService {

  private readonly queue: Queue;
  private readonly worker?: Worker;
  private readonly queueName = 'apiCallQueue';

  constructor() {
    this.queue = new Queue(this.queueName, { connection: redis });

    if (ENV === ENVIRONMENTS.production) {
      this.worker = this.initializeWorker();
      this.attachLifecycleHandlers();
    }

  }

  private initializeWorker(): Worker {
    if (ENV !== ENVIRONMENTS.production) {
      throw new Error('Worker should not be initialized in development');
    }
    return new Worker(
      this.queueName,
      async (job: Job<BadgeJobData>) => this.processJob(job),
      {
        connection: redisWorker,
        concurrency: 1
      }
    );
  }

  private async processJob(job: Job<BadgeJobData>): Promise<void> {
    const { urlGet } = job.data;
    console.info(`Processing delayed call: ${urlGet}`);
    const cacheKey = `delayed_call:${urlGet}`;
    const response = await axios.get(urlGet)
    await new Promise(resolve => setTimeout(resolve, 300));
    redisService.setCachedData(cacheKey, response.data, 3600);

  }





  public async getCachedDelayedResponse(urlGet: string): Promise<any> {
    const cacheKey = `delayed_call:${urlGet}`;
    const cachedData = await redisService.getCachedData(cacheKey);
    if (cachedData) {
      console.info(`Cache hit for key: ${cacheKey}`);
      return cachedData;
    }
    await this.addJob(urlGet)
    return null;
  }

  public async addJob(urlGet: string): Promise<void> {
    const existingJob = await this.queue.getJob(urlGet);
    if (
      !existingJob ||
      (await existingJob.isCompleted()) ||
      (await existingJob.isFailed())
    ) {
      await this.queue.remove(urlGet);
      await this.queue.add(this.queueName, { urlGet }, { jobId: urlGet });
    }
  }

  private attachLifecycleHandlers() {
    if (!this.worker) return;

    this.worker.on('error', (err) => {
      console.error('[BullMQ Worker Error]', err);
    });

    this.queue.on('error', (err) => {
      console.error('[BullMQ Queue Error]', err);
    });

    //On process exit
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
