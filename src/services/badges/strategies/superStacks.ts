import { BaseBadgeStrategy } from './badgeStrategy';
import { redisService } from '../../redis.service';
import axios from 'axios';

export class SuperStacksStrategy extends BaseBadgeStrategy {
  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `superStacks-${eoas.join(',')}`;
    const ttl = 3600;

    const fetchFunction = async () => {
      let points = 0;
      for (const eoa of eoas) {
        const response = await axios.get(
          `http://obl-data-gateway-dev-568660380.us-east-1.elb.amazonaws.com:8000/superchain/user-points?wallet_address=${eoa}`
        );
        console.log(response.data);
        points += response.data.points;
      }
      return points;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}
