import { generateNonce } from "siwe";

import { WC_PROJECT_ID as projectId } from "../config/superChain/constants";

import { signJwt, verifyJwt } from "@/utils/jwt";

import { SiweMessage } from 'siwe';

export const getAddressFromMessage = (message: string) => new SiweMessage(message).address;
export const getChainIdFromMessage = (message: string | number) => new SiweMessage(String(message)).chainId;



type VerifyParams = {
  address: string;
  message: string;
  signature: string;
  chainId?: number | string;   // acepta "eip155:8453" o 8453
  projectId?: string;          // ignorado (compatibilidad con @reown/appkit-siwe)
  nonce?: string;              // opcional: si guardas nonce del /nonce
  domain?: string;             // opcional: normalmente req.headers.host
};

function parseChainId(input?: number | string): number | null {
  if (input === undefined) return null;
  if (typeof input === "number" && Number.isFinite(input)) return input;
  const s: string = String(input);
  const last: string = s.includes(":") ? s.split(":").pop()! : s;
  const n: number = Number(last);
  return Number.isFinite(n) ? n : null;
}

function equalsAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Verifica firma SIWE en servidor (drop-in de @reown/appkit-siwe.verifySignature).
 * Retorna true/false. projectId se ignora en backend.
 */
export async function verifySiweSignature(params: VerifyParams): Promise<boolean> {
  const siwe: SiweMessage = new SiweMessage(params.message);

  // Chequeos locales opcionales coherentes con tu código actual:
  const providedChainId: number | null = parseChainId(params.chainId);
  if (params.address && !equalsAddress(siwe.address, params.address)) return false;
  if (providedChainId !== null && siwe.chainId !== providedChainId) return false;

  const { success } = await siwe.verify({
    signature: params.signature,
    nonce: params.nonce,   // pásalo si guardas nonce en sesión/redis
    domain: params.domain, // típicamente req.headers.host
  });

  return !!success;
}


export function getNonce(_, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
}


async function validateSignature(req, res) {
    const start = Date.now();
    if (!req.body.message) {
        return res.status(400).json({ error: 'SiweMessage is undefined' });
    }

    const message = req.body.message;
    const address = getAddressFromMessage(message);
    let chainId = getChainIdFromMessage(message);


    const isValid = await verifySiweSignature({
        address,
        message,
        signature: req.body.signature,
        chainId,
        projectId,
    });
    console.log("[verifySignature] Duration:", Date.now() - start, "ms");
    return { isValid, address, chainId, message };
}

export async function verifySignature(req, res) {
    try {
        console.time("validateSignature");
        let { isValid, address, chainId } = await validateSignature(req, res);
        console.timeEnd("validateSignature");
        if (!isValid) {
            throw new Error('Invalid signature');
        }
        if (chainId.includes(":")) {

            chainId = chainId.split(":")[1];
        }

        chainId = Number(chainId);

        if (isNaN(chainId)) {
            throw new Error("Invalid chainId");
        }

        const token = signJwt({ address, chainId });
        res.status(200).json({ token });
        console.log('[verifySignature] Success:', { address, chainId });
        // req.session.siwe = { address, chainId };
        // req.session.save(() => res.status(200).send(true));

    } catch (e: any) {
        console.error(e)
        // req.session.siwe = null;
        // req.session.nonce = null;
        // req.session.save(() => res.status(500).json({ message: e.message }));
        res.status(500).json({ message: e.message })
    }
}


// export async function getSession(req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(req.session.siwe);
// }

// export async function signOut(req, res) {
//     req.session.siwe = null;
//     req.session.nonce = null;
//     req.session.save(() => res.send({}));
// }

export async function getSession(req, res) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    try {
        const token = auth.slice(7);
        const payload = verifyJwt(token);
        res.json(payload);
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

export async function signOut(_, res) {
    res.json({ success: true });
}