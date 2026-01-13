import express, { Request, Response, NextFunction } from 'express';
import { redisService } from './redis.service';
// ======================
// Config
// ======================
export const SAFE_CLIENT_BASE = 'https://safe-client.safe.global'; // upstream actual
const SAFE_BEARER = () => process.env.SAFE_API_TOKEN ?? ''; // <-- pon tu token en env


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

function upstreamUrlFromReq(req: Request): string {

    return SAFE_CLIENT_BASE + req.url;
}


type HeaderEntry = { key: string; value: string };

type CachedResponse = {
    url: string;
    headers: HeaderEntry[];
    status: number;
    body: any;
};



async function passthroughUpstream(req: Request, res: Response, ttl?: number): Promise<void> {
    const url = upstreamUrlFromReq(req);
    const method = req.method.toUpperCase();
    const startMs = Date.now();
    const reqId =
        (req.headers['x-request-id'] as string) ??
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    console.info(
        `[SAFE][${reqId}] IN ${method} path=${req.path} originalUrl=${req.originalUrl} upstream=${url} ttl=${ttl ?? 0} cl=${req.header('content-length') ?? 'na'} ct=${req.header('content-type') ?? 'na'}`
    );

    const init: RequestInit = {
        method,
        headers: buildUpstreamHeaders(req),
    };

    if (!['GET', 'HEAD'].includes(method)) {
        const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
        console.debug(`[SAFE][${reqId}] IN bodyBytes=${Buffer.byteLength(bodyStr, 'utf8')}`);

        (init.headers as Record<string, string>)['content-type'] ??= 'application/json';
        (init as any).body = bodyStr;
    }

    res.once('finish', () => console.info(`[SAFE][${reqId}] RES finish status=${res.statusCode} ms=${Date.now() - startMs}`));
    res.once('close', () => console.warn(`[SAFE][${reqId}] RES close  status=${res.statusCode} ms=${Date.now() - startMs} headersSent=${res.headersSent}`));

    const fetchApi = async () => {

        const upstream = await fetch(url, init);
        console.info(
            `[SAFE][${reqId}] UPSTREAM status=${upstream.status} ms=${Date.now() - startMs} ct=${upstream.headers.get('content-type') ?? 'na'} cl=${upstream.headers.get('content-length') ?? 'na'}`
        );

        const headers: HeaderEntry[] = [];
        upstream.headers.forEach((value, key) => {
            if (!['content-security-policy'].includes(key)) headers.push({ key, value });
        });
        let data: any;
        try {
            data = await upstream.json();
        } catch (err: any) {
            console.error(
                `[SAFE][${reqId}] UPSTREAM json() failed status=${upstream.status} ct=${upstream.headers.get('content-type') ?? 'na'} msg=${err?.message ?? err}`
            );
            throw err;
        }

        return {
            url,
            status: upstream.status,
            headers,
            body: data
        }

    }


    const canCache = method === 'GET' && ttl && ttl > 0;
    console.debug(`[SAFE][${reqId}] CACHE ${canCache ? `ON ttl=${ttl}` : 'OFF'}`);

    const response: CachedResponse = canCache
        ? await redisService.getCachedDataWithCallback(url, fetchApi, ttl, true)
        : await fetchApi();

    res.status(response.status);
    console.info(
        `[SAFE][${reqId}] OUT status=${response.status} ms=${Date.now() - startMs} headersSent=${res.headersSent}`
    );


    for (const { key, value } of response.headers) {
        // Salta headers problemáticos/hop-by-hop
        if (
            ![
                'content-security-policy',
                'transfer-encoding',
                'connection',
                'keep-alive',
                'proxy-authenticate',
                'proxy-authorization',
                'te',
                'trailer',
                'upgrade',
                // opcionalmente: 'set-cookie', 'content-length', 'content-encoding'
            ].includes(key.toLowerCase())
        ) {
            if (value !== undefined) res.setHeader(key, value);
        }
    }

    res.json(response.body);
    return;



}

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



export async function handleSafeRequest(p: string, req: Request, res: Response): Promise<void> {

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
}



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




export async function handleTxPropose(req: Request, res: Response): Promise<void> {
    // Va a SAFE_CLIENT_BASE + req.url y añade Bearer automáticamente
    await passthroughUpstream(req, res);
    return;
}
/** GET safe detail: /v1/chains/:chainId/safes/:address */
export async function handleSafeDetail(req: Request, res: Response): Promise<void> {

    await passthroughUpstream(req, res);
    return;
}

/** GET balances USD: /v1/chains/:chainId/safes/:address/balances/usd */
export async function handleBalancesUsd(req: Request, res: Response): Promise<void> {

    await passthroughUpstream(req, res, 15);
    return;
}

/** GET chains root: /v1/chains */
export async function handleChains(req: Request, res: Response): Promise<void> {

    await passthroughUpstream(req, res, 7200);
    return;
}

/** GET messages: /v1/chains/:chainId/safes/:address/messages */
export async function handleMessages(req: Request, res: Response): Promise<void> {

    await passthroughUpstream(req, res);
    return;
}

/** GET tx history: /v1/chains/:chainId/safes/:address/transactions/history */
export async function handleTxHistory(req: Request, res: Response): Promise<void> {

    await passthroughUpstream(req, res, 60);
    return;
}

/** GET tx queued: /v1/chains/:chainId/safes/:address/transactions/queued */
export async function handleTxQueued(req: Request, res: Response): Promise<void> {

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
    await passthroughUpstream(req, res, 60);
    return;
}
