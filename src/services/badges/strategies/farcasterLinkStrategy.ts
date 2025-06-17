import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";




export class FarcasterLinkStrategy extends BaseBadgeStrategy {


    async getValue(eoas: string[]): Promise<boolean> {
        const cacheKey = `farcasterLink-${eoas.join(',')}`;
        const data = await redisService.getCachedData(cacheKey)
        return data?.signature.length > 0 ? true : false;
    }


}