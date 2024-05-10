import { Router } from 'express';
import { BadgesServices } from '../services/badges.service';

const routes = Router();

routes.get('/', async (req, res) => {
  res.json({
    some: process.env.SUPABASE_URL,
    other: process.env.SUPABASE_ANON_KEY,
  });
});

routes.get('/get-badges', async (req, res) => {
  const headers = req.headers;
  const eoas = (headers.address as string)?.split(',');
  const account = headers.account as string;

  console.log(eoas, account);
  if (!eoas || !account) {
    res.json({ error: 'Invalid request' });
  }

  try {
    const badgesService = new BadgesServices();
    const currentBadges = await badgesService.getBadges(eoas, account);
    const totalPoints = currentBadges.reduce((acc, badge) => {
      return acc + badge.points;
    }, 0);
    return res.json({
      totalPoints,
      currentBadges,
    });
  } catch (error) {
    return res.json({ error });
  }
});

export default routes;
