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
import { getAirdrop } from '@/controllers/airdrop';
import { rpcReverseProxy, verifyInternalRequest } from '@/controllers/rpcProxy';
import { getVaults, refreshVaults } from '@/controllers/vaults';
import { raffleClaim } from '@/controllers/raffle';
import { verifyWorldId } from '@/controllers/worldID';
import { verifyFarcaster } from '@/controllers/farcaster';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ClientRequest, IncomingMessage, ServerResponse } from 'http';

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

routes.get('/vaults/:account', getVaults);

routes.post('/vaults/:account/refresh', refreshVaults);

routes.post('/relay', relay);

routes.post('/user-op-reverse-proxy', verifyReverseProxy, reverseProxy);

routes.use('/rpc', verifyInternalRequest, rpcReverseProxy);

routes.get('/campaigns/:account', getCampaigns);

routes.post('/raffle/claim', raffleClaim);

routes.post('/world-id/verify/:account', verifyOwner, verifyWorldId);

routes.post('/farcaster/verify/:account', verifyOwner, verifyFarcaster);


const CHAIN_MAP: Record<string, string> = {
  '10': 'oeth',
  // agrega más mappings...
};

// Reinyectar body JSON (equivalente a fixRequestBody) usando tipos de node
function forwardJsonBody(proxyReq: ClientRequest, req: IncomingMessage) {
  const anyReq = req as any;
  const method: string | undefined = anyReq.method;
  const body = anyReq.body;
  if (!body) return;
  if (method && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyStr));
    proxyReq.write(bodyStr);
  }
}


routes.use(
  '/safe/v1/chains/:chainId/safes/:address',
  createProxyMiddleware({
    target: 'https://api.safe.global',
    changeOrigin: true,

    pathRewrite: (path, req) => {
      const anyReq = req as any;
      const chainId: string | undefined = anyReq.params?.chainId;
      const address: string | undefined = anyReq.params?.address;
      const key = chainId ? CHAIN_MAP[chainId] : undefined;
      if (!key || !address) return path; // sin mapping → deja caer al fallback

      const rewritten = `/tx-service/${key}/api/v1/safes/${address}/`; // barra final
      console.log('[SAFE REDIRECT] rewrite:', path, '->', rewritten);
      return rewritten;
    },

    on: {
      proxyReq: (proxyReq, req, res) => {
        const token = process.env.SAFE_API_TOKEN;
        if (token) proxyReq.setHeader('authorization', `Bearer ${token}`);

        // Quita cookies si no sirven
        // @ts-ignore: removeHeader existe en ClientRequest de node >=18
        if (typeof (proxyReq as any).removeHeader === 'function') {
          (proxyReq as any).removeHeader('cookie');
        }

        forwardJsonBody(proxyReq as ClientRequest, req as IncomingMessage);

        const p: any = proxyReq as any; // props internas para log
        console.log(`[SAFE REDIRECT] ${(req as any).method} -> ${p.protocol}//${p.host}${p.path}`);
      },

      error: (err, _req, res) => {
        const sres = res as ServerResponse;
        const anyErr = err as { code?: string; message?: string };
        console.error('[SAFE REDIRECT ERROR]', anyErr?.code, anyErr?.message);
        sres.statusCode = 502;
        sres.end(`Upstream error: ${anyErr?.code ?? 'UNKNOWN'}`);
      },
    },
  })
);


routes.use(
  '/safe',
  createProxyMiddleware({
    target: 'https://safe-client.safe.global', // URL de destino
    changeOrigin: true,
    pathRewrite: {
      '^/safe': '', // elimina el prefijo /safe al reenviar
    }
  })
);


export default routes;
