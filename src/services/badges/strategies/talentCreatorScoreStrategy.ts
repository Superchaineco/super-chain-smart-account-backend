import { BaseBadgeStrategy } from './badgeStrategy';
import { redisService } from '../../redis.service';
import axios from 'axios';

type ScoreSlug = "builder_score" | "creator_score";

type ScoreItem = {
  calculating_score: boolean;
  calculating_score_enqueued_at: string | null;
  last_calculated_at: string;
  points: number;
  slug: ScoreSlug;
}
type ScoreResponse = {
  scores: ScoreItem[];
};


export class TalentCreatorScoreStrategy extends BaseBadgeStrategy {
  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `talentCreatorScore-${eoas.join(',')}`;
    const ttl = 3600;

    const fetchFunction = async () => {
      let highestTalentScore = 0;
      for (const eoa of eoas) {
        const scores = await axios.get<ScoreResponse>(`https://api.talentprotocol.com/scores?id=${eoa}`, {
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

        if (scores && scores.data && scores.data.scores) {
          const creator: ScoreItem | undefined = scores.data.scores?.find(
            (s: ScoreItem) => s.slug === "creator_score"
          );

          if (creator && creator.points > highestTalentScore)
            highestTalentScore = Number(creator.points)
        }
      }
      return highestTalentScore;
    };


    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}
