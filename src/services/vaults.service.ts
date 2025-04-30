import { JSON_RPC_PROVIDER } from '@/config/superChain/constants';
import axios from 'axios';
import { Contract, formatUnits, JsonRpcProvider } from 'ethers';
import { RedisService } from './redis.service';

const tokenImages = {
  ETH: 'https://staging.account.superchain.eco/images/vaults/icons/ETH_OP.svg',
  USDC: 'https://staging.account.superchain.eco/images/vaults/icons/USDC_OP.svg',
  USDT: 'https://staging.account.superchain.eco/images/vaults/icons/USDT_OP.svg'
};

export class VaultsService {
  private redisService: RedisService;

  constructor(redisService: RedisService) {
    this.redisService = redisService;
  }

  private async getVaultsData() {
    const cache_key = 'vaults_data';
    const fetchFunction = async () => {
      const allAPRs = await axios.get(
        'https://v3-api.compound.finance/market/all-networks/all-contracts/rewards/dapp-data'
      );

      return allAPRs.data
        .filter((apr: any) => apr.chain_id === 10)
        .map((apr: any) => ({
          comet: apr.comet.address,
          rewards_apr: apr.earn_rewards_apr,
          asset: apr.base_asset.address,
          symbol: apr.base_asset.symbol,
          decimals: apr.base_asset.decimals,
          image: tokenImages[apr.base_asset.symbol] || null
        }));
    };

    return this.redisService.getCachedDataWithCallback(cache_key, fetchFunction, 3600);
  }

  private async getVaultAPR(vault: any) {
    const cache_key = `vault_apr_${vault.comet}`;
    const fetchFunction = async () => {
      try {
        const provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
        const comet = new Contract(
          vault.comet,
          [
            {
              inputs: [
                { internalType: 'uint256', name: 'utilization', type: 'uint256' },
              ],
              name: 'getSupplyRate',
              outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'getUtilization',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            }
          ],
          provider
        );

        const utilization = await comet.getUtilization();
        const supplyRate = await comet.getSupplyRate(utilization);
        const secondsPerYear = 31536000;
        const scale = 10 ** 18;

        return ((Number(supplyRate)) / scale) * secondsPerYear;
      } catch (error: any) {
        console.error(error.message)
        //throw new Error(error)
      }
    };

    return this.redisService.getCachedDataWithCallback(cache_key, fetchFunction, 3600);
  }

  private async getVaultBalance(vault: any, account: string) {
    const cache_key = `vault_balance_${vault.comet}_${account}`;
    const fetchFunction = async () => {
      try {
        const provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
        const comet = new Contract(
          vault.comet,
          [
            {
              inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
              name: 'balanceOf',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            }
          ],
          provider
        );

        console.log({ account })
        const balance = await comet.balanceOf(account);
        return formatUnits(balance, vault.decimals);

      } catch (error: any) {
        console.error(error)
        return 0;
        //throw new Error(error)
      }
    };

    return this.redisService.getCachedDataWithCallback(cache_key, fetchFunction, 3600);
  }

  public async getVaultsAPR(account: string) {
    const vaults = await this.getVaultsData();

    const vaultsWithData = await Promise.all(
      vaults.map(async (vault) => {
        const [balance, interest_apr] = await Promise.all([
          this.getVaultBalance(vault, account),
          this.getVaultAPR(vault)
        ]);

        return {
          ...vault,
          balance: balance.toString(),
          interest_apr: interest_apr.toString()
        };
      })
    );

    return vaultsWithData;
  }

  public async refreshVaultsCache(account: string) {
    const vaults = await this.getVaultsData();

    for (const vault of vaults) {
      await this.redisService.deleteCachedData(`vault_balance_${vault.comet}_${account}`);
    }
  }
}
