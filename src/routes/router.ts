import { Router } from 'express';
import { verifyReverseProxy, verifyOwner } from '../middleware/auth';
import { getUser, refreshEOAS } from '../controllers/user';
import { claimBadges, getBadges } from '../controllers/badges';
import { perksByAccount, perksByLevel } from '../controllers/perks';
import {
  getBalance,
  relay,
  reverseProxy,
  validateSponsorship,
} from '../controllers/sponsor';
import { paginatedLeaderboard, rankByAccount } from '@/controllers/leaderboard';
import { getAirdrop } from '@/controllers/airdrop';
export const routes = Router();

routes.get('/user/:account', getUser);

routes.post('/user/:account/refresh-eoas', refreshEOAS);

routes.get('/user/:account/badges', getBadges);

routes.get('/user/:account/perks', perksByAccount);

routes.get('/airdrop/:account', getAirdrop);

routes.get('/perks/:level', perksByLevel);

routes.get('/user/:account/sponsorship-balance', getBalance);

routes.post('/user/:account/badges/claim', verifyOwner, claimBadges);

routes.get('/leaderboard/:account', rankByAccount);

routes.get('/leaderboard', paginatedLeaderboard);

routes.post('/validate-sponsorship', validateSponsorship);

routes.post('/relay', relay);

routes.post('/user-op-reverse-proxy', verifyReverseProxy, reverseProxy);

export default routes;
