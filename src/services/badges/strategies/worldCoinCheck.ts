import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";



// type PassportCredential = {
//     passport_credentials: {
//         name: string;
//         value: string;
//     }[]
// }



export class WorldCoinCheckStrategy extends BaseBadgeStrategy {

    //TODO improve this there's no need to use cache here
    async getValue(eoas: string[]): Promise<boolean> {
        const cacheKey = `worldID-${eoas.join(',')}`;

        const data = await redisService.getCachedData(cacheKey)
        return data?.proof.length > 0 ? true : false;
    }

    // async getValue(eoas: string[]): Promise<boolean> {
    //     const cacheKey = `worldcoinVerified-${eoas.join(",")}`;
    //     const ttl = 3600

    //     const fetchFunction = async () => {
    //         let isWorldcoinVerified = false;
    //         for (const eoa of eoas) {
    //             const passportCredentials = await axios.get<PassportCredential>('https://api.talentprotocol.com/api/v2/passport_credentials', {
    //                 headers: {
    //                     "x-api-key": process.env.TALENT_API_KEY!
    //                 },
    //                 params: {
    //                     passport_id: eoa,
    //                 }
    //             })
    //             if (passportCredentials.data.passport_credentials.find(c => c.name === "World ID" && c.value === "Verified")) {
    //                 return true;
    //             }
    //         }

    //         return isWorldcoinVerified;
    //     };

    //     return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    // }
}