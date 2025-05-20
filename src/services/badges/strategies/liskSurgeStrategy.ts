import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";
import { getBadgesQueue } from "../queue";

export class LiskSurgeStrategy extends BaseBadgeStrategy {

    campaigns: string[] = ["Lisk Surge"]

    async getValue(eoas: string[]): Promise<number> {
        

        const amount = eoas.reduce(async (accPromise, eoa) => {
            const urlGet = `https://blockscout.lisk.com/api?module=account&action=txlist&address=${eoa}`
            const queueService = getBadgesQueue('blockscout')
            const response = await queueService.getCachedDelayedResponse(urlGet);
            const total = response.result
                .filter(tx => tx.from.toLowerCase() === '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae'.toLowerCase())
                .reduce((acc: number, tx) => {
                    const value = Number(tx.value) / Math.pow(10, 18);
                    return acc + value;
                }, 0);
            return (await accPromise) + total;
        }, Promise.resolve(0));

        return amount
    }
}