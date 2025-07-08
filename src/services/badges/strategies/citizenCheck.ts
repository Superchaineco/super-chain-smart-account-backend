import { redisService } from '@/services/redis.service';
import { BaseBadgeStrategy, DEFAULT_TTL } from './badgeStrategy';
import axios from 'axios';

export class CitizenCheckStrategy extends BaseBadgeStrategy {
  async getValue(eoas: string[]): Promise<boolean> {
    const cacheKey = `citizenCheck-${eoas.join(',')}`;

    const fetchFunction = async () => {
      const citizenApiUrl = 'https://optimism.easscan.org/graphql';

      const citizenQuery = `
    query AddressGivethDonations($addresses: [String!]!) {
      attestations(
        take: 10,
        where: {
          schemaId: {
            equals: "0xc35634c4ca8a54dce0a2af61a9a9a5a3067398cb3916b133238c4f6ba721bc8a"
          }
          recipient: {
            in: $addresses
          }
        }
      ) {
        schemaId
        recipient
        data
      }
    }`;

      const response = await axios.post(citizenApiUrl, {
        query: citizenQuery,
        variables: {
          addresses: eoas,
        },
      });

      if (response.data.data.attestations.length > 0) return true;

      return false;
    };

    return redisService.getCachedDataWithCallback(
      cacheKey,
      fetchFunction,
      DEFAULT_TTL
    );
  }
}
