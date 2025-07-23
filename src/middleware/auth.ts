import { Request, Response, NextFunction } from "express";
import { superChainAccountService } from "../services/superChainAccount.service";
import { ENV, ENVIRONMENTS } from "../config/superChain/constants";
import { verifyJwt } from "@/utils/jwt";

export async function verifyOwner(req: Request, res: Response, next: NextFunction) {
    // Development environment bypass
    if (ENV === ENVIRONMENTS.development) {
        return next();
    }

    try {
        const { address } = verifySession(req);

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
    // Development environment bypass
    if (ENV === ENVIRONMENTS.development) {
        return next();
    }

    try {
        const { address } = verifySession(req);
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


// function verifySession(req, res) {
//     if (!req.session.siwe || !req.session.siwe.address) {
//         console.debug("Session", req.session);
//         throw new Error('Unauthorized');
//     }
//     return { address: req.session.siwe.address, chainId: req.session.siwe.chainId };

// }

function verifySession(req: Request) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = auth.slice(7);
  const payload = verifyJwt(token) as { address: string; chainId: number };

  if (!payload.address) throw new Error("Unauthorized");

  return payload;
}