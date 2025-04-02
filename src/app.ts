import express from 'express';
import Session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import { RedisStore } from 'connect-redis';
import * as middleware from './utils/middleware';
import router from './routes/router';
import authRouter from './routes/auth';
import {
  DOMAIN,
  ENV,
  ENVIRONMENTS,
  SESSION_SECRET,
} from './config/superChain/constants';
import { redis } from './utils/cache';

const app = express();
console.debug('ENV', ENV);

app.use(
  cors({
    origin: DOMAIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(
  Session({
    name: 'Super-account-SIWE',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redis, prefix: 'super-account-siwe:' }),
    cookie: {
      secure: ENV === ENVIRONMENTS.development ? false : true,
      sameSite: 'none',
      maxAge: 7 * 24 * 3600 * 1000,
    },
    rolling: true,
  })
);

app.set('trust proxy', 1);
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

app.use('/api', router);
app.use('/auth', authRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
