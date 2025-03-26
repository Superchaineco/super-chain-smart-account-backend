import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";

export class SoneiumTransactionsStrategy extends BaseBadgeStrategy {


    async getValue(eoas: string[]): Promise<number> {
        const cacheKey = `soneiumTransactions-${eoas.join(",")}`;
        const ttl = 3600

        const fetchFunction = async () => {
            const transactions = eoas.reduce(async (accPromise, eoa) => {
                
                const response = await axios.get(`https://soneium.blockscout.com/api/v2/addresses/${eoa}/counters`)                
                const transactions = Number(response.data.transactions_count);
                return (await accPromise) + transactions;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}