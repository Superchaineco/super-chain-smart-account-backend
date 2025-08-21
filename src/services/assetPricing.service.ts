import axios from 'axios';
import { redisService } from './redis.service';
import { COINGECKO_API_KEY } from '@/config/superChain/constants';

export async function getAssetPrice(assetAddress: string): Promise<number> {
  const fetchFunction = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/token_price/celo?contract_addresses=${assetAddress}&vs_currencies=usd`,
        {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': COINGECKO_API_KEY,
          },
        }
      );

      const priceData = response.data[assetAddress.toLowerCase()];

      if (!priceData && !priceData.usd || priceData.usd === 0) {
        throw new Error('Price data not found');
      }
      return priceData.usd;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch asset price');
    }
  };

  const cacheKey = `asset_price_${assetAddress}`;
  return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, 3600);
}
