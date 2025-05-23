import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";

export class MetalTransactionsStrategy extends BaseBadgeStrategy {

    async getValue(eoas: string[]): Promise<number> {
        const cacheKey = `metalTransactions-${eoas.join(",")}`;
        const ttl = 7200

        const fetchFunction = async () => {
            const transactions = eoas.reduce(async (accPromise, eoa) => {
                const response = await axios.get(`https://explorer-metal-mainnet-0.t.conduit.xyz/api/v2/addresses/${eoa}/counters`)
                const transactions = Number(response.data.result.transactions_count);
                return (await accPromise) + transactions;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}