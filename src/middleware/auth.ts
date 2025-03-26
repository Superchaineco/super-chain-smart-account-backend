import { Request, Response, NextFunction } from "express";
import { superChainAccountService } from "../services/superChainAccount.service";

export async function verifyOwner(req: Request, res: Response, next: NextFunction) {
    try {
        const { address } = verifySession(req, res);

        const account = req.params.account as string;

        if (!account) {
            return res.status(400).json({ message: "Invalid request, account is missing" });
        }

        const isOwner = await superChainAccountService.isOwnerOfSmartAccount(address, account);

        if (!isOwner) {
            return res.status(403).json({ message: "Wallet is not the owner of the SuperChain Smart Account" });
        }

        next();
    } catch (error) {
        console.error("Error in verifyOwner middleware", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}


export async function verifyReverseProxy(req: Request, res: Response, next: NextFunction) {
    try {
        const { address } = verifySession(req, res);
        if (req.body.method == "eth_sendUserOperation") {
            const account = req.body.params[0].sender;
            const isOwner = await superChainAccountService.isOwnerOfSmartAccount(address, account);
            if (!isOwner) {
                return res.status(403).json({ message: "Wallet is not the owner of the SuperChain Smart Account" });
            }
        }

        next();

    } catch (error) {
        console.error("Error in verifyReverseProxy middleware", error);
        return res.status(401).json({ message: "Unauthorized" });
    }


}


function verifySession(req, res) {
    if (!req.session.siwe || !req.session.siwe.address) {
        console.debug("Session", req.session);
        throw new Error('Unauthorized');
    }
    return { address: req.session.siwe.address, chainId: req.session.siwe.chainId };

}
