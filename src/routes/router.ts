import { Router } from 'express';

const routes = Router();

routes.get('/', async (req, res) => {
  res.send({ status: 'ok' });
});

export default routes;
