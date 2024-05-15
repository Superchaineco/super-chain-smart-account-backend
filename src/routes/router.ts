import { Router } from 'express';
import { BadgesServices } from '../services/badges.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { superChainAccountService } from '../services/superChainAccount.service';
import { ZeroAddress } from 'ethers';

const routes = Router();

routes.get('/', async (req, res) => {
  res.json({
    some: process.env.SUPABASE_URL,
    other: process.env.SUPABASE_ANON_KEY,
  });
});

routes.get('/get-badges', async (req, res) => {
  const headers = req.headers;
  const account = headers.account as string;
  if (!account || account === ZeroAddress) {
    res.json({ error: 'Invalid request' });
  }

  try {
    const badgesService = new BadgesServices();
    const eoas = await superChainAccountService.getEOAS(account);
    const currentBadges = await badgesService.getBadges(eoas, account);
    console.debug('currentBadges', currentBadges);
    const totalPoints = currentBadges.reduce((acc, badge) => {
      return acc + badge.points;
    }, 0);
    return res.json({
      totalPoints,
      currentBadges,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

routes.put('/badge', async (req, res) => {
  let query = req.query;
  if (!query.badgeid || !query.account) {
    return res.json({ error: 'Invalid request' });
  }
  const badgeId = query.badgeid as string;
  const account = query.account as string;
  delete query.badgeid;
  delete query.account;
  try {
    const badgesService = new BadgesServices();
    const badge = await badgesService.updateBadge(account, badgeId, query);
    return res.json(badge);
  } catch (error) {
    return res.json({ error });
  }
});
export default routes;
