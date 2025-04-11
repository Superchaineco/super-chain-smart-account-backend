import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";


type TalentPassport = {
    score: {
      points: number;
  }
}


export class TalentScoreStrategy extends BaseBadgeStrategy {

  async getValue(eoas: string[]): Promise<number> {
     const cacheKey = `talentScore-${eoas.join(",")}`;
    const ttl = 3600

    const fetchFunction = async () => {
      let highestTalentScore = 0;
      for (const eoa of eoas) {
      const talentPassport = await axios.get<TalentPassport>(`https://api.talentprotocol.com/score?id=${eoa}`, {
          headers: {
            "x-api-key": process.env.TALENT_API_KEY!
          }
        }).catch(error => {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            return;
          }
          console.error(`Error fetching talent passport for ${eoa}:`, error);
          return;
        });
        
        if (talentPassport && talentPassport.data && talentPassport.data.score && talentPassport.data.score.points > highestTalentScore) {
          highestTalentScore = talentPassport.data.score.points;
        }
      }
      return highestTalentScore;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  } 
}
