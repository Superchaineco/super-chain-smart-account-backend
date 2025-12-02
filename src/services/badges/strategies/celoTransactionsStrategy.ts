import { redisService } from "@/services/redis.service";
import axios from "axios";
import { BaseBadgeStrategy } from "./badgeStrategy";
import { BLOCKSCOUT_API_KEY } from "@/config/superChain/constants";

export class Celo2TransactionsStrategy extends BaseBadgeStrategy {


    async getValue(eoas: string[]): Promise<number> {
        const cacheKey = `celo2Transactions-${eoas.join(",")}`;
        const ttl = 3600

        const fetchFunction = async () => {
            const transactions = eoas.reduce(async (accPromise, eoa) => {
                const response = await axios.get(`https://celo.blockscout.com/api?module=account&action=txlist&address=${eoa}&sort=asc&startblock=31056500&endblock=99999999&apikey=${BLOCKSCOUT_API_KEY}`)
                const transactions = response.data.result.filter((tx: any) => tx.from.toLowerCase() === eoa.toLowerCase()).length;
                return (await accPromise) + transactions;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}