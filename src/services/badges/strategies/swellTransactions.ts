import { BaseBadgeStrategy, DEFAULT_TTL } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";
import { ROUTESCAN_API_KEY } from "@/config/superChain/constants";

export class SwellTransactionsStrategy extends BaseBadgeStrategy {


  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `swellTransactions-${eoas.join(",")}`;

    const fetchFunction = async () => {
      const transactions = eoas.reduce(async (accPromise, eoa) => {
        const response = await axios.get(`https://api.routescan.io/v2/network/mainnet/evm/1923/etherscan/api?apikey=${ROUTESCAN_API_KEY}&module=account&action=txlist&address=${eoa}&startblock=0&endblock=99999999&page=1&offset=250&sort=asc`)
        const transactions = response.data.result.filter((tx: any) => tx.from.toLowerCase() === eoa.toLowerCase()).length;
        return (await accPromise) + transactions;
      }, Promise.resolve(0));

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, DEFAULT_TTL);
  }
}