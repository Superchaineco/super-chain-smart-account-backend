import { Request, Response } from "express";
import { superChainAccountService } from "../services/superChainAccount.service";

export async function getUser(req: Request, res: Response) {
    const account = req.params.account as string;

    if (!account) {
        return res.status(500).json({ error: "Invalid request" });
    }

    try {
        const superchainsmartaccount = await superChainAccountService.getSuperChainSmartAccount(account);
        const badges = (await superChainAccountService.getSuperChainSmartAccountBadges(account)).map((badge => ({
            ...badge,
            badge: {
                ...badge.badge,
                metadata: {
                    ...badge.badge.metadata,
                    image: badge.badge.metadata?.image?.replace('/Badge.svg', `/T${badge.tier}.svg`),
                    'stack-image': null,
                },
            }
        })));
        const replacer = (key: string, value: any) => typeof value === "bigint" ? value.toString() : value;

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
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function refreshEOAS(req: Request, res: Response) {
    const account = req.params.account as string;

    if (!account) {
        return res.status(500).json({ error: "Invalid request" });
    }

    try {
        const eoas = await superChainAccountService.refreshEOASCache(account);
        return res.status(200).json({ eoas });
    } catch (error) {
        console.error("Error refreshing EOAS cache:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

