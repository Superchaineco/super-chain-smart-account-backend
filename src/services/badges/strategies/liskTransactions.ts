import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";

export class LiskTransactionsStrategy extends BaseBadgeStrategy {

    async getValue(eoas: string[]): Promise<number> {
        const cacheKey = `liskTransactions-${eoas.join(",")}`;
        const ttl = 3600

        const fetchFunction = async () => {

            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;
                const result = await axios.post("https://blockscout.lisk.com/api/eth-rpc", {
                    "jsonrpc": "2.0",
                    "method": "eth_getTransactionCount",
                    "params": [
                        eoa,
                        "latest"
                    ],
                    "id": 0
                });
                return acc + parseInt(result.data.result, 16);
            }, Promise.resolve(0));

            return 21
            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}