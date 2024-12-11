
import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import { ExecutionResult } from "graphql";
import { execute, GetFirst100UsersLevel3Document, GetFirst100UsersLevel3Query } from ".graphclient";

export class EarlyAdoptersStrategy extends BaseBadgeStrategy {


    async getValue(eoas: string[], account?: string): Promise<boolean> {
        const cacheKey = `earlyAdoptersStrategy-${eoas.join(",")}`;
        const ttl = 3600

        const fetchFunction = async () => {
            const { data, errors }: ExecutionResult<GetFirst100UsersLevel3Query> = await execute(
                GetFirst100UsersLevel3Document,
                {}
            )
            if (errors) {
                console.error(errors)
                return false
            }
            const isEarlyAdopter = data?.levelClaims.some(claim => claim.account.id.toLowerCase() === account.toLowerCase())

            return isEarlyAdopter

        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}