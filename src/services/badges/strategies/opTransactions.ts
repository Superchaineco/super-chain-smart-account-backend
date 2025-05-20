import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";

export class OpTransactionsStrategy extends BaseBadgeStrategy {

  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `optimisimTransactions-${eoas.join(",")}`;
    const ttl = 7200

    const fetchFunction = async () => {
      const settings = {
        apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
        network: Network.OPT_MAINNET,
      };

      const alchemy = new Alchemy(settings);
      const transactions = await eoas.reduce(async (accPromise, eoa) => {
        const acc = await accPromise;
        const result = await alchemy.core.getTransactionCount(eoa);
        return acc + result;
      }, Promise.resolve(0)); 

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}