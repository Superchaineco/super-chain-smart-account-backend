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
  // ...
};

function forwardJsonBody(proxyReq: ClientRequest, req: IncomingMessage) {
  const anyReq = req as any;
  const method = anyReq.method?.toUpperCase?.();
  const body = anyReq.body;
  if (!body) return;
  if (method && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyStr));
    proxyReq.write(bodyStr);
  }
}

/**
 * 1) Proxy específico: solo para la ruta EXACTA:
 *    /safe/v1/chains/:chainId/safes/:address  (sin segmentos extras)
 */
const specificProxy = createProxyMiddleware({
  target: 'https://api.safe.global',
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // path aquí incluirá el prefijo /safe, porque montamos en routes.use('/safe', ...)
    // p.ej. "/v1/chains/10/safes/0x...".
    const match = path.match(/^\/v1\/chains\/(\d+)\/safes\/([^/]+)\/?$/);
    if (!match) return path;
    const [, chainId, address] = match;
    const key = CHAIN_MAP[chainId];
    if (!key) return path;
    return `/tx-service/${key}/api/v1/safes/${address}/`;
  },
  on: {
    proxyReq: (proxyReq, req) => {
      const token = process.env.SAFE_API_TOKEN;
      if (token) proxyReq.setHeader('authorization', `Bearer ${token}`);
      // quitar cookies innecesarias
      // @ts-ignore
      if (typeof (proxyReq as any).removeHeader === 'function') (proxyReq as any).removeHeader('cookie');
      forwardJsonBody(proxyReq as ClientRequest, req as IncomingMessage);
    },
    error: (err, _req, res) => {
      const sres = res as ServerResponse;
      const anyErr = err as { code?: string; message?: string };
      sres.statusCode = 502;
      sres.end(`Upstream error: ${anyErr?.code ?? 'UNKNOWN'}`);
    },
  },
});

/**
 * Middleware selector: si req.path (dentro del router) coincide EXACTAMENTE con
 * /v1/chains/:chainId/safes/:address[/], entonces delega al specificProxy.
 * En cualquier otro caso, llamamos next() para que lo maneje el fallback.
 */
routes.use('/safe', (req, res, next) => {
  // req.path dentro del router será "/v1/..." si montas routes como app.use('/api', routes)
  const path = req.path || req.url || '';
  const exactSafeRegex = /^\/v1\/chains\/(\d+)\/safes\/([^/]+)\/?$/;
  const match = path.match(exactSafeRegex);

  if (match) {
    // Si no hay mapping de chain, podemos devolver 400 o dejar que el fallback lo procese.
    const chainId = match[1];
    if (!CHAIN_MAP[chainId]) {
      return res.status(400).json({ error: `Unsupported chainId ${chainId}` });
    }
    // Llama al proxy específico (usa la instancia creada arriba)
    return specificProxy(req as any, res as any, next as any);
  }

  // No es la ruta exacta del safe => continuar al proxy general (fallback)
  return next();
});

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
