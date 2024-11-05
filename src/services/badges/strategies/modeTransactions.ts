import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import { CovalentClient } from "@covalenthq/client-sdk";

export class ModeTransactionsStrategy extends BaseBadgeStrategy {

  covalent = new CovalentClient(process.env.COVALENT_API_KEY!);

  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `modeTransactions-${eoas.join(",")}`;
    const ttl = 86400; // 1 day

    const fetchFunction = async () => {
      const transactions = eoas.reduce(async (accPromise, eoa) => {
        const resp =
          await this.covalent.TransactionService.getAllTransactionsForAddressByPage(
            "mode-testnet",
            eoa,
          );
        return (await accPromise) + resp.data.items.length;
      }, Promise.resolve(0));

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}