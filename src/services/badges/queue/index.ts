import { redis, redisWorker } from '@/utils/cache';
import { Queue, Worker, Job } from 'bullmq';
import { redisService } from '@/services/redis.service';
import { ENV, ENVIRONMENTS } from '@/config/superChain/constants';
import axios from 'axios';

interface BadgeJobData {
  urlGet: string;
}

interface CachedData {
  data: any;
  timestamp: number;
}

export class BadgesQueueService {
  public readonly queue: Queue;
  private readonly worker?: Worker;
  private queueName = 'apiCallQueue';

  constructor(queueName: string) {
    this.queueName = queueName;
    this.queue = new Queue(this.queueName, {
      connection: redis, defaultJobOptions: {
        removeOnComplete: {
          age: 3600,
          count: 1000
        },
        removeOnFail: {
          age: 86400,
          count: 500
        }
      }
    });

    if (ENV !== ENVIRONMENTS.development) {
      this.worker = this.initializeWorker();
      this.attachLifecycleHandlers();
    }
  }

  private initializeWorker(): Worker {
    if (ENV === ENVIRONMENTS.development) {
      throw new Error('Worker should not be initialized in development');
    }
    return new Worker(
      this.queueName,
      async (job: Job<BadgeJobData>) => this.processJob(job),
      {
        connection: redisWorker,
        concurrency: this.queueName === 'routescan' ? 1 : 3,
        limiter: {
          max: this.queueName === 'routescan' ? 2 : 5,
          duration: 1000,
        },
      }
    );
  }

  private async processJob(job: Job<BadgeJobData>): Promise<any> {
    const { urlGet } = job.data;
    await job.log(`Processing delayed call: ${urlGet}`);
    const cacheKey = `delayed_call:${urlGet}`;

    const response = await axios.get(urlGet);
    await job.log(`Processed delayed call: ${urlGet}`);
    const cachedData: CachedData = {
      data: response.data,
      timestamp: Date.now()
    }

    await redisService.setCachedData(cacheKey, cachedData, 0);
    return response.data;
  }

  public async getCachedDelayedResponse(urlGet: string): Promise<any> {
    const cacheKey = `delayed_call:${urlGet}`;
    try {
      const cachedData: CachedData = await redisService.getCachedData(cacheKey);
      if (cachedData) {
        console.info(`Cache hit for key: ${cacheKey}`);

        if (!cachedData.timestamp || cachedData.timestamp + 3600000 < Date.now()) {
          console.log(`⌚⌚⌚⌚⌚⌚⌚Refreshing cache for key: ${cacheKey}`);
          await this.addJob(urlGet);
        } else {
          console.log(`🆗🆗🆗🆗🆗🆗Cache no need to refresh key: ${cacheKey}`);
        }

        return cachedData.data;
      }
    } catch (error) {
      console.log('Error getting cached data', error);
    }

    await this.addJob(urlGet);
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
      await this.queue.add(
        this.queueName,
        { urlGet },
        {
          jobId: urlGet,
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: {
            age: 3600,
            count: 1000
          },
        }
      );
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
export const queuesInstances: Map<string, BadgesQueueService> = new Map();


export const getBadgesQueue = (service: string): BadgesQueueService => {

  if (queuesInstances.size === 0) {
    // queuesInstances.set('routescan', new BadgesQueueService('routescan'));
    queuesInstances.set('blockscout', new BadgesQueueService('blockscout'));
  }


  return queuesInstances.get(service);
}

