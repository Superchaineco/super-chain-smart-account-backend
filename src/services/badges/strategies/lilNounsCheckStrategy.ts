import { BaseBadgeStrategy } from "./badgeStrategy";
import { ethers } from "ethers";
import { redisService } from "../../redis.service";

export class LilNounsCheckStrategy extends BaseBadgeStrategy {
  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `hasLilNouns-${eoas.join(",")}`;
    const ttl = 86400;

    const fetchFunction = async () => {
      const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_ETH_PROVIDER);
      const contract = new ethers.Contract(
        process.env.LIL_NOUNS_CONTRACT_ADDRESS!,
        ["function balanceOf(address owner) public view returns (uint256)"],
        provider,
      );

      let countNouns: bigint = BigInt(0); 

      for (const eoa of eoas) {
        const balance: bigint = await contract.balanceOf(eoa); 
        countNouns += balance;
      }

      return Number(countNouns); 
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}
