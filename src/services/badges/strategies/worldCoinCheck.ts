import { BaseBadgeStrategy } from "./badgeStrategy";
import axios from "axios";
import { redisService } from "../../redis.service";



type PassportCredential = {
    passport_credentials: {
        name: string;
        value: string;
    }[]
}



export class WorldCoinCheckStrategy extends BaseBadgeStrategy {


    async getValue(eoas: string[]): Promise<boolean> {
        const cacheKey = `worldcoinVerified-${eoas.join(",")}`;
        const ttl = 3600

        const fetchFunction = async () => {
            let isWorldcoinVerified = false;
            for (const eoa of eoas) {
                const passportCredentials = await axios.get<PassportCredential>('https://api.talentprotocol.com/api/v2/passport_credentials', {
                    headers: {
                        "x-api-key": process.env.TALENT_API_KEY!
                    },
                    params: {
                        passport_id: eoa,
                    }
                })
                if (passportCredentials.data.passport_credentials.find(c => c.name === "World ID" && c.value === "Verified")) {
                    return true;
                }
            }

            return isWorldcoinVerified;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}