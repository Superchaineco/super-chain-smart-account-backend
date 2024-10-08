import { Request, Response, NextFunction } from "express";
import privyService from "../services/privy.service";
import { superChainAccountService } from "../services/superChainAccount.service";
import { UserProfile } from "../types/index.types";

export async function verifyOwner(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        // Verifica que el encabezado Authorization exista y esté en el formato correcto
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Extrae el token y verifica las reclamaciones
        const token = authHeader.split(" ")[1];
        const claims = await privyService.verifyAuthToken(token);
        if (!claims) return res.status(401).json({ message: "Unauthorized" });

        // Obtén la información del usuario a partir del token
        const user: UserProfile = await privyService.getUserInfo(claims?.userId);
        const wallet = user.linked_accounts.find(linked => linked.type === "wallet");

        if (!wallet) {
            return res.status(401).json({ message: "No wallet linked to user" });
        }

        // Extrae el account del header o body (según cómo se envíe en el request)
        const account = req.headers.account as string;

        if (!account) {
            return res.status(400).json({ message: "Invalid request, account is missing" });
        }

        // Verifica si la wallet es owner del SuperChain Smart Account
        const isOwner = await superChainAccountService.isOwnerOfSmartAccount(wallet.address, account);

        if (!isOwner) {
            return res.status(403).json({ message: "Wallet is not the owner of the SuperChain Smart Account" });
        }

        // Almacena el user y la wallet en la request para reutilizarlos en los handlers
        req.user = user;
        req.wallet = wallet;

        // Continúa con el siguiente middleware o la ruta
        next();
    } catch (error) {
        console.error("Error in verifyOwner middleware", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
