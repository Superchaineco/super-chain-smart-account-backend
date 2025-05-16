import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { Queue } from 'bullmq';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ENV, ENVIRONMENTS } from '../config/superChain/constants';

import { redis } from './cache';
import { queuesInstances } from '@/services/badges/queue';

export const setupBullBoard = (app: any) => {

  if (ENV !== ENVIRONMENTS.development) {
    return;
  }

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');
  const queueAdapters = Array.from(queuesInstances.values()).map((serviceInstance) =>
    new BullMQAdapter(serviceInstance.queue)
  );
  createBullBoard({
    queues: queueAdapters,
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
};
