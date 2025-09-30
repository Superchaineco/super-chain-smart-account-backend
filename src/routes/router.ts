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
import express, { Request, Response, NextFunction } from 'express';



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


// ======================
// Config
// ======================
const SAFE_CLIENT_BASE = 'https://safe-client.safe.global'; // upstream actual
const SAFE_BEARER = () => process.env.SAFE_API_TOKEN ?? ''; // <-- pon tu token en env

// ======================
// Helpers
// ======================

// Copia headers “seguros” al upstream y añade Bearer.
// Puedes afinar la lista si necesitas re-enviar más/menos headers.
function buildUpstreamHeaders(req: Request): Record<string, string> {
  const h = new Headers();
  // Reenvía algunos headers típicos
  const fwd: string[] = [
    'accept',
    'accept-language',
    'content-type',
    'user-agent',
    'x-forwarded-for',
    'x-forwarded-proto',
  ];
  for (const k of fwd) {
    const v = req.header(k);
    if (v) h.set(k, v);
  }
  // Siempre Bearer (para estos endpoints capturados)
  const token = SAFE_BEARER();
  if (token) h.set('authorization', `Bearer ${token}`);

  // Evita pasar cookies al upstream
  // (si necesitas alguna, quita esta línea)
  // @ts-ignore
  h.delete?.('cookie');

  // Devuelve como objeto simple
  const out: Record<string, string> = {};
  // @ts-ignore
  h.forEach((v: string, k: string) => (out[k] = v));
  return out;
}

// Construye URL final al SAFE_CLIENT manteniendo querystring
function upstreamUrlFromReq(req: Request): string {
  // Dentro de routes.use('/safe', ...) el req.url comienza en "/v1/..."
  // => pegamos directo a la base
  return SAFE_CLIENT_BASE + req.url;
}

// Llama al upstream con fetch y retorna tal cual (bypass).
// Aquí luego podrás “enriquecer” y transformar la respuesta antes de res.json(...)
async function passthroughUpstream(req: Request, res: Response): Promise<void> {
  const url = upstreamUrlFromReq(req);
  const method = req.method.toUpperCase();

  const init: RequestInit = {
    method,
    headers: buildUpstreamHeaders(req),
  };

  if (!['GET', 'HEAD'].includes(method)) {
    const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    (init.headers as Record<string, string>)['content-type'] ??= 'application/json';
    (init as any).body = bodyStr;
  }

  const upstream = await fetch(url, init);

  res.status(upstream.status);
  upstream.headers.forEach((value, key) => {
    if (!['content-security-policy'].includes(key)) res.setHeader(key, value);
  });

  const ct = upstream.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await upstream.json();
    res.json(data);           // ⬅️ no retornes Response
    return;                   // ⬅️ termina sin valor
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  res.send(buf);              // ⬅️ idem
  return;
}


// ======================
// Expresiones regulares
// ======================
// NOTA: Estas regex trabajan dentro de '/safe' (o sea, empiezan en /v1/...)
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



// ======================
// Handlers (bypass ahora)
// ======================


// Si te sirve, helpers para extraer params del path (opcional)
const rxAddress = /0x[a-fA-F0-9]{40}/;
function getChainId(req: Request): string | undefined {
  const m = req.path.match(/^\/v1\/chains\/(\d+)\b/);
  return m?.[1];
}
function getAddress(req: Request): string | undefined {
  const m = req.path.match(rxAddress);
  return m?.[0];
}

/** GET safe detail: /v1/chains/:chainId/safes/:address */
export async function handleSafeDetail(req: Request, res: Response): Promise<void> {
  const chainId = getChainId(req);
  const address = getAddress(req);
  // TODO: mapear chainId → key, consultar otros servicios, ensamblar payload
  await passthroughUpstream(req, res);
  return;
}

/** GET balances USD: /v1/chains/:chainId/safes/:address/balances/usd */
export async function handleBalancesUsd(req: Request, res: Response): Promise<void> {
  const chainId = getChainId(req);
  const address = getAddress(req);
  // TODO: enriquecer balances, normalizar formato, cache/currency rates
  await passthroughUpstream(req, res);
  return;
}

/** GET chains root: /v1/chains */
export async function handleChains(req: Request, res: Response): Promise<void> {
  // TODO: cachear lista, traducir IDs, filtrar redes soportadas
  await passthroughUpstream(req, res);
  return;
}

/** GET messages: /v1/chains/:chainId/safes/:address/messages */
export async function handleMessages(req: Request, res: Response): Promise<void> {
  const chainId = getChainId(req);
  const address = getAddress(req);
  // TODO: mergear con mensajes offchain/otros backends, paginar
  await passthroughUpstream(req, res);
  return;
}

/** GET tx history: /v1/chains/:chainId/safes/:address/transactions/history */
export async function handleTxHistory(req: Request, res: Response): Promise<void> {
  const chainId = getChainId(req);
  const address = getAddress(req);
  // TODO: componer con tu backend, ordenar, mapear estados, paginación
  await passthroughUpstream(req, res);
  return;
}

/** GET tx queued: /v1/chains/:chainId/safes/:address/transactions/queued */
export async function handleTxQueued(req: Request, res: Response): Promise<void> {
  const chainId = getChainId(req);
  const address = getAddress(req);
  // TODO: idem history, priorización, merge con colas internas
  await passthroughUpstream(req, res);
  return;
}

/** GET module tx (variant 1): /v1/chains/:chainId/transactions/module_0x..._id<hash> */
export async function handleModuleTx(req: Request, res: Response): Promise<void> {
  const chainId = getChainId(req);
  // Puedes extraer el módulo/hash si lo necesitas:
  // const m = req.path.match(/module_(0x[a-fA-F0-9]{40})_id([0-9a-f]{64})/);
  // const moduleAddr = m?.[1]; const idHash = m?.[2];
  // TODO: confirmar esquema exacto y transformar a tu shape
  await passthroughUpstream(req, res);
  return;
}



// ======================
// Dispatcher
// ======================

routes.use('/safe', async (req, res, next) => {
  const p = req.path;

  try {
    if (reBalancesUsdExact.test(p)) { await handleBalancesUsd(req, res); return; }
    if (reSafeDetailExact.test(p))   { await handleSafeDetail(req, res); return; }
    if (reChainsRoot.test(p))        { await handleChains(req, res); return; }
    if (reMessagesExact.test(p))     { await handleMessages(req, res); return; }
    if (reTxHistoryExact.test(p))    { await handleTxHistory(req, res); return; }
    if (reTxQueuedExact.test(p))     { await handleTxQueued(req, res); return; }
    if (reModuleTx.test(p))         { await handleModuleTx(req, res); return; }
  } catch (err: any) {
    console.error('[SAFE DISPATCH ERROR]', err?.message);
    res.status(502).json({ error: 'Upstream error', detail: err?.message }); // ⬅️ no retornar
    return;
  }

  return next();
});


// ======================
// Proxy general (fallback)
// ======================

routes.use(
  '/safe',
  createProxyMiddleware({
    target: SAFE_CLIENT_BASE,
    changeOrigin: true,
    pathRewrite: { '^/safe': '' },
  })
);


export default routes;
