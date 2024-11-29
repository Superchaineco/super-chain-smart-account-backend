import { Request, Response } from "express";
import { superChainAccountService } from "../services/superChainAccount.service";

export async function getUser(req: Request, res: Response) {

    const account = req.params.account as string;

    if (!account) {
        return res.status(500).json({ error: "Invalid request" });
    }
    const superchainsmartaccount =
        await superChainAccountService.getSuperChainSmartAccount(account);
    const badges =
        await superChainAccountService.getSuperChainSmartAccountBadges(account);
    const replacer = (key: string, value: any) =>
        typeof value === "bigint" ? value.toString() : value;

    return res.status(200).json(
        JSON.parse(
            JSON.stringify(
                {
                    superchainsmartaccount,
                    badges,
                },
                replacer,
            ),
        ),
    );
}

