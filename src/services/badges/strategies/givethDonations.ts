import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";

export class GivethDonationsStrategy extends BaseBadgeStrategy {

    async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `givethDonations-${eoas.join(",")}`;
    const ttl = 3600

    const fetchFunction = async () => {
      const givethApiUrl = "https://mainnet.serve.giveth.io/graphql";

      const donationsQuery = `
        query AddressGivethDonations($fromWalletAddresses: [String!]!) {
        donationsFromWallets(fromWalletAddresses: $fromWalletAddresses) {
          valueUsd
          createdAt
          }
        }
        `;
      const query = {
        query: donationsQuery,
        variables: {
          fromWalletAddresses: [...eoas],
        },
      };

      try {
        const response = await fetch(givethApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });

        const res = await response.json();
        if (!res?.data?.donationsFromWallets) return 0;

        return (
          res.data.donationsFromWallets as {
            valueUsd: number;
            createdAt: string;
          }[]
        ).reduce((total, d) => total + d.valueUsd, 0);
      } catch (error) {
        console.log(error);
        return 0;
      }
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}