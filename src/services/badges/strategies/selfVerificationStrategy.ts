import { redisService } from "@/services/redis.service";
import { BaseBadgeStrategy } from "./badgeStrategy";
import { getAccountByAddress, setAccountNationality } from "@/services/account.service";

export class SelfVerificationStrategy extends BaseBadgeStrategy {


    async getValue(eoas: string[], extraData: any | undefined): Promise<boolean> {

        return false;
        const account = extraData.account

        const accountData = await getAccountByAddress(account)
        let nationality = accountData?.nationality

        console.log('Self data for ', account, ' nat: ', nationality, ' with preid', extraData.selfUserId);
        if (!nationality && !extraData.selfUserId)
            return false


        if (!nationality) {
            const cache_pre_key = `self_id_pre:${extraData.selfUserId}`
            const preSelfData = await redisService.getCachedData(cache_pre_key)
            if (preSelfData) {
                setAccountNationality(account, preSelfData.nationality)
                nationality = preSelfData.nationality
                await redisService.deleteCachedData(cache_pre_key);

            } else {
                return false
            }
        }
        if (nationality != null && nationality != '')
            return true
        return false

    }
}
