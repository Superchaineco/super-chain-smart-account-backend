import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";
import { ROUTESCAN_API_KEY } from "@/config/superChain/constants";
import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";

export class InkTransactionsStrategy extends BaseBadgeStrategy {


  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `inkTransactions-${eoas.join(",")}`;
    const ttl = 3600

    const fetchFunction = async () => {
      const settings = {
        apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
        network: Network.INK_MAINNET,
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