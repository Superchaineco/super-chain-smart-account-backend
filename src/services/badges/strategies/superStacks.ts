import { BaseBadgeStrategy } from './badgeStrategy';
import { redisService } from '../../redis.service';
import axios from 'axios';

export class SuperStacksStrategy extends BaseBadgeStrategy {

  campaigns: string[] = ["SuperStacks"]

  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `superStacks-${eoas.join(',')}`;
    const ttl = 7200;

    const fetchFunction = async () => {
      let points = 0;
      for (const eoa of eoas) {
        const response = await axios.get(
          `https://www.data-openblocklabs.com/superchain/user-points?wallet_address=${eoa}`
        );
        console.log(response.data);
        points += response.data.points;
      }
      return points;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}
