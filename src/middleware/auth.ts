import { Request, Response, NextFunction, json } from "express";
import privyService from "../services/privy.service";
import { superChainAccountService } from "../services/superChainAccount.service";
import { UserProfile } from "../types/index.types";

export async function verifyOwner(req: Request, res: Response, next: NextFunction) {
    try {
        const claims = await verifyAuthToken(req, res);
        if (!claims) return res.status(401).json({ message: "Unauthorized" });
        const user: UserProfile = await privyService.getUserInfo(claims?.userId);
        const wallet = user.linked_accounts.find(linked => linked.type === "wallet");

        if (!wallet) {
            return res.status(401).json({ message: "No wallet linked to user" });
        }

        const account = req.headers.account as string;

        if (!account) {
            return res.status(400).json({ message: "Invalid request, account is missing" });
        }

        const isOwner = await superChainAccountService.isOwnerOfSmartAccount(wallet.address, account);

        if (!isOwner) {
            return res.status(403).json({ message: "Wallet is not the owner of the SuperChain Smart Account" });
        }


        next();
    } catch (error) {
        console.error("Error in verifyOwner middleware", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export async function verifyReverseProxy(req: Request, res: Response, next: NextFunction) {
    const claims = await verifyAuthToken(req, res);
    if (!claims) return res.status(401).json({ message: "Unauthorized" });
    if (req.body.method == "eth_sendUserOperation") {
        const user: UserProfile = await privyService.getUserInfo(claims?.userId);
        const wallet = user.linked_accounts.find(linked => linked.type === "wallet");
        const account = req.body.params[0].sender;
        if (!wallet) {
            return res.status(401).json({ message: "No wallet linked to user" });
        }

        const isOwner = await superChainAccountService.isOwnerOfSmartAccount(wallet.address, account);
        if (!isOwner) {
            return res.status(403).json({ message: "Wallet is not the owner of the SuperChain Smart Account" });
        }
    }
    next();
}


async function verifyAuthToken(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return;
    }

    const token = authHeader.split(" ")[1];
    const claims = await privyService.verifyAuthToken(token);
    return claims;
}
