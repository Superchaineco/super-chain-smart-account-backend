import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { Queue } from 'bullmq';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ENV, ENVIRONMENTS } from '../config/superChain/constants';

import { redis } from './cache'; 

export const setupBullBoard = (app: any) => {
  // Solo configurar Bull Board en desarrollo
  if (ENV !== ENVIRONMENTS.development) {
    return;
  }

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const badgesQueue = new Queue('badgesQueue', { connection: redis });
  createBullBoard({
    queues: [new BullMQAdapter(badgesQueue) as any],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
};
