import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";

export class LiskSurgeStrategy extends BaseBadgeStrategy {


    async getValue(eoas: string[]): Promise<number> {
        const cacheKey = `liskSurge-${eoas.join(",")}`;
        const ttl = 3600


        const fetchFunction = async () => {
            const amount = eoas.reduce(async (accPromise, eoa) => {
                const response = await axios.get(`https://blockscout.lisk.com/api?module=account&action=txlist&address=${eoa}`)
                const total = response.data.result
                    .filter(tx => tx.from.toLowerCase() === '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae'.toLowerCase())
                    .reduce((acc: number, tx) => {
                        const value = Number(tx.value) / Math.pow(10, 18);
                        return acc + value;
                    }, 0);
                return (await accPromise) + total;
            }, Promise.resolve(0));

            return amount;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}