import { generateNonce } from "siwe";

import { WC_PROJECT_ID as projectId } from "../config/superChain/constants";
import { getAddressFromMessage, getChainIdFromMessage, verifySignature as veriftSiweSignature } from "@reown/appkit-siwe";
import { signJwt, verifyJwt } from "@/utils/jwt";
export function getNonce(_, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
}


async function validateSignature(req, res) {
    if (!req.body.message) {
        return res.status(400).json({ error: 'SiweMessage is undefined' });
    }

    const message = req.body.message;
    const address = getAddressFromMessage(message);
    let chainId = getChainIdFromMessage(message);


    const isValid = await veriftSiweSignature({
        address,
        message,
        signature: req.body.signature,
        chainId,
        projectId,
    });
    return { isValid, address, chainId, message };
}

export async function verifySignature(req, res) {
    try {
        let { isValid, address, chainId } = await validateSignature(req, res);
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