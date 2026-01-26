import { Router } from 'express';
import { verifyReverseProxy, verifyOwner } from '../middleware/auth';
import { getUser, refreshEOAS } from '../controllers/user';
import { claimBadges, getBadges } from '../controllers/badges';
import { perksByAccount, perksByLevel } from '../controllers/perks';
import { getCampaigns } from '../controllers/campaigns';
import {
  getBalance,
  relay,
  reverseProxy,
  validateSponsorship,
} from '../controllers/sponsor';
import { paginatedLeaderboard, rankByAccount } from '@/controllers/leaderboard';
import { rpcReverseProxy, verifyInternalRequest } from '@/controllers/rpcProxy';
import { getVaults, refreshVaults } from '@/controllers/vaults';
import { raffleClaim } from '@/controllers/raffle';
import { verifyWorldId } from '@/controllers/worldID';
import { verifyFarcaster } from '@/controllers/farcaster';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { handleBalancesUsd, handleChains, handleMessages, handleModuleTx, handleSafeDetail, handleSafeRequest, handleTxHistory, handleTxPropose, handleTxQueued, SAFE_CLIENT_BASE } from '@/services/safe.service';
import { getAirdrop, postAirdrop } from '@/controllers/airdrop';
import selfVerify, { getNationalitiesBatch, selfCheck } from '@/controllers/self';
import { getAccount, getAccountByUsername, getAllAccounts, postAccountsByEOAs, requireApiKey } from '@/controllers/account';
import { liskBoost } from '@/controllers/liskBoost';




export const routes = Router();


routes.get('/user/:account', getUser);

routes.post('/user/:account/refresh-eoas', refreshEOAS);

routes.get('/user/:account/badges', getBadges);

routes.get('/user/:account/perks', perksByAccount);

routes.get('/airdrop/:account/:label', getAirdrop);

routes.post('/airdrop/:account', postAirdrop);

routes.get('/perks/:level', perksByLevel);

routes.get('/user/:account/sponsorship-balance', getBalance);

routes.post('/user/:account/badges/claim', claimBadges);  //verifyOwner

routes.get('/leaderboard/:account', rankByAccount);

routes.get('/leaderboard', paginatedLeaderboard);

routes.post('/validate-sponsorship', validateSponsorship);

routes.get('/vaults/:account', getVaults);

routes.post('/vaults/:account/refresh', refreshVaults);

routes.post('/relay', relay);

routes.post('/self/verify', selfVerify);

routes.get('/self/check', selfCheck);

routes.post('/leaderboard/nationalities', getNationalitiesBatch);


routes.post('/user-op-reverse-proxy', verifyReverseProxy, reverseProxy);

routes.use('/rpc', verifyInternalRequest, rpcReverseProxy);

routes.get('/campaigns/:account', getCampaigns);

routes.post('/raffle/claim', raffleClaim);

routes.post('/world-id/verify/:account', verifyOwner, verifyWorldId);

routes.post('/farcaster/verify/:account', verifyOwner, verifyFarcaster);

routes.use('/account/by-address/:address', requireApiKey, getAccount);

routes.use(
  '/account/by-username/:username',
  requireApiKey,
  getAccountByUsername
);
routes.use('/accounts', requireApiKey, getAllAccounts);

routes.post('/accounts/by-eoas', requireApiKey, postAccountsByEOAs);



routes.post('/lisk-boost', liskBoost);


routes.use('/safe', async (req, res, next) => {
  const p = req.path;
  await handleSafeRequest(p, req, res)
  return next();
});


routes.use(
  '/safe',
  createProxyMiddleware({
    target: SAFE_CLIENT_BASE,
    changeOrigin: true,
    pathRewrite: { '^/safe': '' },
  })
);


export default routes;
