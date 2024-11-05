import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";

export class BaseTransactionsStrategy extends BaseBadgeStrategy {

  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `baseTransactions-${eoas.join(",")}`;
    const ttl = 86400; // 1 day

    const fetchFunction = async () => {
      const settings = {
        apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
        network: Network.BASE_MAINNET,
      };
      const alchemy = new Alchemy(settings);
      const transactions = await eoas.reduce(async (accPromise, eoa) => {
        const acc = await accPromise;
        const { transfers } = await alchemy.core.getAssetTransfers({
          toBlock: "latest",
          fromAddress: eoa,
          excludeZeroValue: true,
          category: [
            AssetTransfersCategory.ERC20,
            AssetTransfersCategory.ERC1155,
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.ERC721,
          ],
        });
        if (!transfers) return acc;
        return acc + transfers.length;
      }, Promise.resolve(0));

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}