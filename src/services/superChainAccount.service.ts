import { Contract, JsonRpcProvider } from "ethers";
import {
  JSON_RPC_PROVIDER,
  SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS,
  SUPER_CHAIN_MODULE_ABI,
} from "../config/superChain/constants";
import Safe from "@safe-global/protocol-kit";
import { BadgesServices } from "./badges/badges.service";
import { redisService } from "./redis.service";

export class SuperChainAccountService {
  superChainAccount: Contract;
  badgesService: BadgesServices

  constructor() {
    this.superChainAccount = new Contract(
      SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS,
      SUPER_CHAIN_MODULE_ABI,
      new JsonRpcProvider(JSON_RPC_PROVIDER),
    );
    this.badgesService = new BadgesServices();
  }

  async getEOAS(address: string): Promise<string[]> {
    const cacheKey = `eoas-${address}`;
    const ttl = 3600;
    const fetchFunction = async () => {
      // @ts-expect-error ESM import
      const protocolKit = await Safe.default.init({
        provider: JSON_RPC_PROVIDER,
        safeAddress: address,
      });
      return await protocolKit.getOwners();
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async refreshEOASCache(address: string): Promise<string[]> {
    const cacheKey = `eoas-${address}`;
    await redisService.deleteCachedData(cacheKey);
    return this.getEOAS(address);
  }

  async getIsLevelUp(recipent: string, points: number): Promise<boolean> {
    return await this.superChainAccount.simulateIncrementSuperChainPoints(
      points,
      recipent,
    );
  }

  async getSuperChainSmartAccount(address: string): Promise<any> {
    const cacheKey = `smart-account-${address}`;
    const ttl = 3600; 

    const fetchFunction = async () => {
      const response = await this.superChainAccount.getSuperChainAccount(address);
      // Convertir el objeto/array manteniendo su estructura
      return JSON.parse(JSON.stringify(response, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async getSuperChainSmartAccountBadges(address: string) {
    const data = await this.badgesService.fetchBadges(address);

    const badgeServices = new BadgesServices();

    const tierPromises = data!.accountBadges.flatMap((badge) =>
      badge.badge.badgeTiers.map((tier) =>
        badgeServices.getBadgeLevelMetadata(tier),
      ),
    );
    const tierResults = await Promise.all(tierPromises);
    for (const badge of data!.accountBadges) {
      badge.badge.metadata = await badgeServices.getBadgeMetadata(badge);
      badge.badge.badgeTiers.forEach((tier) => {
        const result = tierResults.find((res) => res.tier.uri === tier.uri);
        if (result) {
          tier["metadata"] = result.metadata;
        }
      });
    }
    return data!.accountBadges;
  }

  public async isOwnerOfSmartAccount(wallet: string, account: string): Promise<boolean> {
    const owners = (await this.getEOAS(account)).map((owner) => owner.toLowerCase());
    return owners.includes(wallet.toLocaleLowerCase());
  }

  async getAccountLevel(account: string): Promise<number> {
    const superChainSmartAccount = await this.getSuperChainSmartAccount(account);
    const accountLevel = Number(superChainSmartAccount[3]);
    return accountLevel;
  }


}
const superChainAccountService = new SuperChainAccountService();
export { superChainAccountService };
