import { JSON_RPC_PROVIDER } from '@/config/superChain/constants';
import axios from 'axios';
import { Contract, JsonRpcProvider } from 'ethers';
import { redisService } from './redis.service';

const tokenImages = {
  ETH: 'https://staging.account.superchain.eco/images/vaults/icons/ETH_OP.svg',
  USDC: 'https://staging.account.superchain.eco/images/vaults/icons/USDC_OP.svg',
  USDT: 'https://staging.account.superchain.eco/images/vaults/icons/USDT_OP.svg'
};

async function getVaultsData() {
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

  return redisService.getCachedDataWithCallback(cache_key, fetchFunction, 3600);
}

async function getVaultAPR(vault: any) {
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
    throw new Error(error)
  }
}

async function getVaultBalance(vault: any, account: string) {
  const cache_key = `vault_balance_${vault.comet}_${account}`;
  const fetchFunction = async () => {
    try {

      const provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
      console.log(vault.comet)
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
      return balance.toString();
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  };

  return redisService.getCachedDataWithCallback(cache_key, fetchFunction, 3600);
}

export async function getVaultsAPR(account: string) {
  const vaults = await getVaultsData();

  // Obtener balances y APRs en paralelo
  const vaultsWithData = await Promise.all(
    vaults.map(async (vault) => {
      const [balance, interest_apr] = await Promise.all([
        getVaultBalance(vault, account),
        getVaultAPR(vault)
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

export async function refreshVaultsCache(account: string) {

  const vaults = await getVaultsData();

  for (const vault of vaults) {
    await redisService.deleteCachedData(`vault_balance_${vault.comet}_${account}`);
  }
}
