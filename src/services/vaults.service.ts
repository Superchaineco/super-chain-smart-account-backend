import { JSON_RPC_PROVIDER } from '@/config/superChain/constants';
import axios from 'axios';
import { Contract, JsonRpcProvider } from 'ethers';
import { redisService } from './redis.service';

export async function getVaultsAPR() {
  const compoundVaults = await getCompoundVaultsAPR();
  return [...compoundVaults];
}

async function getCompoundVaultsAPR() {
  const cache_key = 'vaults_apr';
  const fetchFunction = async () => {
    const allAPRs = await axios.get(
      'https://v3-api.compound.finance/market/all-networks/all-contracts/rewards/dapp-data'
    );

    const tokenImages = {
      ETH: 'https://staging.account.superchain.eco/images/vaults/icons/ETH_OP.svg',
      USDC: 'https://staging.account.superchain.eco/images/vaults/icons/USDC_OP.svg',
      USDT: 'https://staging.account.superchain.eco/images/vaults/icons/USDT_OP.svg'
    };

    const allAPRsOP = allAPRs.data
      .filter((apr: any) => apr.chain_id === 10)
      .map((apr: any) => ({
        comet: apr.comet.address,
        rewards_apr: apr.earn_rewards_apr,
        asset: apr.base_asset.address,
        symbol: apr.base_asset.symbol,
        decimals: apr.base_asset.decimals,
        image: tokenImages[apr.base_asset.symbol] || null
      }));
    const provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
    for (const vault of allAPRsOP) {
      console.log(vault.comet);
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
          },
        ],
        provider
      );
      const utilization = await comet.getUtilization();
      const supplyRate = await comet.getSupplyRate(utilization);
      const secondsPerYear = 31536000;
      const scale = 10 ** 18;

      const calculatedApr =
        ((Number(supplyRate)) / scale) * secondsPerYear;
      vault.interest_apr = calculatedApr.toString();
    }

    const compoundVaults = [...allAPRsOP];
    return compoundVaults;
  };
  return redisService.getCachedDataWithCallback(cache_key, fetchFunction, 3600);
}
