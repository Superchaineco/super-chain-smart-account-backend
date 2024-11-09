import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";

export class ModeTransactionsStrategy extends BaseBadgeStrategy {


  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `modeTransactions-${eoas.join(",")}`;
    const ttl = 86400; // 1 day

    const fetchFunction = async () => {
      const transactions = eoas.reduce(async (accPromise, eoa) => {
        const response = await axios.get(`https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan/api?module=account&action=txlist&address=${eoa}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc`)
        const transactions = response.data.result.filter((tx: any) => tx.from.toLowerCase() === eoa.toLowerCase()).length;
        return (await accPromise) + transactions;
      }, Promise.resolve(0));

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}