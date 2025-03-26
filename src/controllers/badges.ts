import { ZeroAddress } from "ethers";
import { Request, Response } from "express";
import { BadgesServices } from "../services/badges/badges.service";
import { superChainAccountService } from "../services/superChainAccount.service";
import { isAbleToSponsor } from "../services/sponsorship.service";
import { AttestationsService } from "../services/attestations.service";
import { redisService } from "@/services/redis.service";

export async function getBadges(req: Request, res: Response) {
    const account = req.params.account as string;
    if (!account || account === ZeroAddress) {
        return res.status(500).json({ error: "Invalid request" });
    }
    try {
        const badgesService = new BadgesServices();        
        const currentBadges = await badgesService.getCachedBadges(account);
        res.json({ currentBadges });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}



export async function claimBadges(req: Request, res: Response) {
    const account = req.params.account as string;
    if (!account) {
        console.error("Invalid request");
        return res.status(500).json({ error: "Invalid request" });
    }
    try {
        const superChainSmartAccount =
            await superChainAccountService.getSuperChainSmartAccount(account);

        // const isAble = await isAbleToSponsor(
        //     account,
        //     Number(superChainSmartAccount[3]),
        // );

        // if (!isAble) {
        //     console.error("User is not able to sponsor");
        //     return res.status(500).json({ error: "User is not able to sponsor" });
        // }

        const badgesService = new BadgesServices();
        const eoas = await superChainAccountService.getEOAS(account);
        const badges = await badgesService.getBadges(eoas, account);
        const attestationsService = new AttestationsService();
        const totalPoints = badgesService.getTotalPoints(badges);
        const badgeUpdates = badgesService.getBadgeUpdates(badges);

        const response = await attestationsService.attest(
            account,
            totalPoints,
            badges,
            badgeUpdates,
        );
        const cacheKey = `user_badges:${account}`;
        await redisService.deleteCachedData(cacheKey);

        return res.status(201).json(response);
    } catch (error) {
        console.error("Error attesting", error);
        return res.status(500).json({ error });
    }
}
