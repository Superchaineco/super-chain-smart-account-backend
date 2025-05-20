import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";
import { getBadgesQueue } from "../queue";

export class LiskTransactionsStrategy extends BaseBadgeStrategy {

    // async getValue(eoas: string[]): Promise<number> {
    //     const cacheKey = `liskTransactions-${eoas.join(",")}`;
    //     const ttl = 3600

    //     const fetchFunction = async () => {

    //         const transactions = await eoas.reduce(async (accPromise, eoa) => {
    //             const acc = await accPromise;
    //             const result = await axios.post("https://blockscout.lisk.com/api/eth-rpc", {
    //                 "jsonrpc": "2.0",
    //                 "method": "eth_getTransactionCount",
    //                 "params": [
    //                     eoa,
    //                     "latest"
    //                 ],
    //                 "id": 0
    //             });
    //             return acc + parseInt(result.data.result, 16);
    //         }, Promise.resolve(0));

    //         return transactions;
    //     };

    //     return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    // }



    async getValue(eoas: string[]): Promise<number> {


        const amount = eoas.reduce(async (accPromise, eoa) => {
            const urlGet = `https://blockscout.lisk.com/api?&module=account&action=txlist&address=${eoa}`
            const queueService = getBadgesQueue('blockscout')
            const response = await queueService.getCachedDelayedResponse(urlGet);
            const total = response?.result.length ?? 0;
            return (await accPromise) + total;
        }, Promise.resolve(0));

        return amount
    }
}