import { generateNonce } from "siwe";

import { WC_PROJECT_ID as projectId } from "../config/superChain/constants";
import { getAddressFromMessage, getChainIdFromMessage, verifySignature as veriftSiweSignature } from "@reown/appkit-siwe";
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


        req.session.siwe = { address, chainId };
        req.session.save(() => res.status(200).send(true));
        console.log('Success verify', req.session.siwe)

    } catch (e: any) {
        console.error(e)
        req.session.siwe = null;
        req.session.nonce = null;
        req.session.save(() => res.status(500).json({ message: e.message }));
    }
}


export async function getSession(req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.debug('Session', req.session);
    res.send(req.session.siwe);
}

export async function signOut(req, res) {
    req.session.siwe = null;
    req.session.nonce = null;
    req.session.save(() => res.send({}));
}