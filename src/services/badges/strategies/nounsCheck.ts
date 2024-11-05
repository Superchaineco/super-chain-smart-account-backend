import { BaseBadgeStrategy } from "./badgeStrategy";
import { ethers } from "ethers";
import { redisService } from "../../redis.service";

export class NounsCheckStrategy extends BaseBadgeStrategy {

    async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `hasNouns-${eoas.join(",")}`;
    const ttl = 86400; 

    const fetchFunction = async () => {
      const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth");
      const contract = new ethers.Contract(
        process.env.NOUNS_CONTRACT_ADDRESS!,
        ["function balanceOf(address owner) public view returns (uint256)"],
        provider,
      );
      let countNouns = 0;
      for (const eoa of eoas) {
        const balance = await contract.balanceOf(eoa);
        if (balance > 0) countNouns++;
      }
      return countNouns;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}