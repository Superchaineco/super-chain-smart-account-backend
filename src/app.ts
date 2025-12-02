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
  ENV
} from './config/superChain/constants';
import { redis } from './utils/cache';
import { setupBullBoard } from './utils/bullBoard';
const app = express();
console.debug('ENV', ENV);
console.log('DOMAIN:', JSON.stringify(DOMAIN));
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

setupBullBoard(app);

app.use(express.json());

const corsOptions = {
  origin(origin, callback) {
    if (!origin || DOMAIN.includes(origin)) {
      callback(null, origin);
    } else {
      console.warn('[CORS] Blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  // credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(
  cors(corsOptions)
);
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('[CORS] Preflight from', req.headers.origin);
  }
  next();
});
// app.use(
//   Session({
//     name: 'Super-account-SIWE',
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: new RedisStore({ client: redis, prefix: 'super-account-siwe:' }),
//     cookie: {
//       secure: ENV === ENVIRONMENTS.development ? false : true,
//       sameSite: 'none',
//       maxAge: 7 * 24 * 3600 * 1000,
//     },
//     rolling: true,
//   })
// );

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: { persistAuthorization: true },
}));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

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
