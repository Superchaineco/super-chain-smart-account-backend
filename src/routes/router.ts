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
import { handleBalancesUsd, handleChains, handleMessages, handleModuleTx, handleSafeDetail, handleTxHistory, handleTxPropose, handleTxQueued, SAFE_CLIENT_BASE } from '@/services/safe.service';
import { getAirdrop, postAirdrop } from '@/controllers/airdrop';




export const routes = Router();

routes.get('/user/:account', getUser);

routes.post('/user/:account/refresh-eoas', refreshEOAS);

routes.get('/user/:account/badges', getBadges);

routes.get('/user/:account/perks', perksByAccount);

routes.get('/airdrop/:account', getAirdrop);

routes.post('/airdrop/:account', postAirdrop);

routes.get('/perks/:level', perksByLevel);

routes.get('/user/:account/sponsorship-balance', getBalance);

routes.post('/user/:account/badges/claim', verifyOwner, claimBadges);

routes.get('/leaderboard/:account', rankByAccount);

routes.get('/leaderboard', paginatedLeaderboard);

routes.post('/validate-sponsorship', validateSponsorship);

routes.get('/vaults/:account', getVaults);

routes.post('/vaults/:account/refresh', refreshVaults);

routes.post('/relay', relay);

routes.post('/user-op-reverse-proxy', verifyReverseProxy, reverseProxy);

routes.use('/rpc', verifyInternalRequest, rpcReverseProxy);

routes.get('/campaigns/:account', getCampaigns);

routes.post('/raffle/claim', raffleClaim);

routes.post('/world-id/verify/:account', verifyOwner, verifyWorldId);

routes.post('/farcaster/verify/:account', verifyOwner, verifyFarcaster);



const reSafeDetailExact =
  /^\/v1\/chains\/(\d+)\/safes\/(0x[a-fA-F0-9]{40})\/?$/;
const reBalancesUsdExact =
  /^\/v1\/chains\/(\d+)\/safes\/(0x[a-fA-F0-9]{40})\/balances\/usd\/?$/;
const reChainsRoot = /^\/v1\/chains\/?$/;
const reMessagesExact =
  /^\/v1\/chains\/(\d+)\/safes\/(0x[a-fA-F0-9]{40})\/messages\/?$/;
const reTxHistoryExact =
  /^\/v1\/chains\/(\d+)\/safes\/(0x[a-fA-F0-9]{40})\/transactions\/history\/?$/;
const reTxQueuedExact =
  /^\/v1\/chains\/(\d+)\/safes\/(0x[a-fA-F0-9]{40})\/transactions\/queued\/?$/;
const reModuleTx = /^\/v1\/chains\/(\d+)\/transactions\/([A-Za-z0-9_]+)$/;
const reTxProposeExact =
  /^\/v1\/chains\/(\d+)\/transactions\/(0x[a-fA-F0-9]{40})\/propose\/?$/;

// ======================
// Dispatcher
// ======================

routes.use('/safe', async (req, res, next) => {
  const p = req.path;

  try {
    if (reBalancesUsdExact.test(p)) { await handleBalancesUsd(req, res); return; }
    if (reSafeDetailExact.test(p)) { await handleSafeDetail(req, res); return; }
    if (reChainsRoot.test(p)) { await handleChains(req, res); return; }
    if (reMessagesExact.test(p)) { await handleMessages(req, res); return; }
    if (reTxHistoryExact.test(p)) { await handleTxHistory(req, res); return; }
    if (reTxQueuedExact.test(p)) { await handleTxQueued(req, res); return; }
    if (reModuleTx.test(p)) { await handleModuleTx(req, res); return; }
    if (reTxProposeExact.test(p)) { await handleTxPropose(req, res); return; }
  } catch (err: any) {
    console.error('[SAFE DISPATCH ERROR]', err?.message);
    res.status(502).json({ error: 'Upstream error', detail: err?.message });
    return;
  }

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
