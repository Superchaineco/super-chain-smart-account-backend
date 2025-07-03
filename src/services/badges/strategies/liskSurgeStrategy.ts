import { BaseBadgeStrategy } from './badgeStrategy';
import { redisService } from '../../redis.service';
import axios from 'axios';
import { getBadgesQueue } from '../queue';
import { AssetTransfersCategory, Network } from 'alchemy-sdk';
import { Alchemy } from 'alchemy-sdk';
import { MerklApi } from '@merkl/api';
import { formatEther, parseEther } from 'ethers';

export class LiskSurgeStrategy extends BaseBadgeStrategy {
  campaigns: string[] = ['Lisk Surge'];

  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `liskSurge-${eoas.join(',')}`;
    const ttl = 3600;

    const fetchFunction = async () => {
      const campaignsIds = [
        '0x60a417b3ef14124e002b70764701a3ed3a6f11c45d30c7763c9b678167f15af6',
        '0x64f71b828983e69f361b1bc1ec725488d75047172b6d312c4ebc9d3d8ec53bb0',
        '0x9590ee446044e1673a471573734d2e190c1eb5bdccb34e034a2cdab3a58e99ee',
        '0x700f9b8c341c72e2e36f0d9133395ae80adc46c51035d3a30a1242e8c1b7b266',
        '0x66183a742b9fb57b8c29e51785a88277a3a8d60418bcdcf820ea9d18040c7862',
        '0xfa244d17d7408d6a397805d50fbdba06584250804234fb3ddb79fc8c0c9ba76a',
        '0x9245382b18a27a4c9801dba2d82e36c58827ac1e688b4eb6a702af90fb634dd6',
        '0xc89715f83bb827256b55751de0e07dd2a12adee97fb9bdd2f77701ea9ee62c5a',
        '0x530a145cb44795b7801aa5adbf39c280aa3edeb1cff04042598747067e43a161',
        '0x136a421299b14574fc884a2f601f6252a2e9e6aa08e6e96e36fcdd1e1e41a53c',
        '0xdeb7be5e0c3a25c373cdcba03e53ec8e2d1f93099f13b68b96b4d879a6be5675',
        '0x08c27c3a6ca68c409ee9dbcb0faa3119e55e854abbaeea4ca6cd57ffc68bedb1',
        '0x81452ff9a16dcdcd5910240a5b05d3a2449faea08a881883c11c8d32ff57fa0b',
        '0x44ba48f18fcf2d835430f373a8d5bfde0a3c3f583f493195958dbce90fc1704e',
        '0xb2f200620e6cc5eacb73b0ba6476f31be9b10c3e212fe828c69bc7b2c76d70b2',
        '0x7caccb9d30c9d27bc369715539b429ecf644640b05df8c5b4e70f33effd746f3',
        '0xd55c6d0d842675304dd2e54202853e87fa0be30e21175d6146982f27263ad4b5',
        '0xfcc0fabcf6ca8b5a08c3cc8ea9ad6b091d6da2ec5aef2f0f1f218b48c4898427',
        '0xf2d96ebbfe5c39829e0fa79358837f6c64f8f9209e99cf700ac9b1bba0c79046',
        '0xd4be8b7b132eccfffe2aa242013a0a4dfd969320767114d24508900248b91bf1',
        '0xe873f9bc612dadab55b638a30bd63f4c252ccaa0757103a86adb6b59ab33e1a6',
        '0xaabed1696d23deddc62743f670a1a40b5a1b4c17c0cc61628fc7b2d1b691b92c',
        '0xcd7f2f6f0f646ea4bb251bd71db6bb24f4334a85d2ae9c49cc2f5d61736859bc',
        '0x4fd521a95e20de9410607d6ef12ca0e66ebf8313222a3ab22eeeff4a8da6b0a5',
        '0x98f158a807b6e1bf8c01d62854302f0805bd1ceb42cafa1be37c521e18908187',
        '0xfd41735a0c84d64918605755adedd32b7844e4049784abb4bd38b9dd1de4e873',
        '0x353e9900d10501a03384551905f7bd67ca1732bce7a02a55e4180e1182c753d2',
        '0x064803c4c5f7aa490d125ee931e92ceb49dffc0c4cb5215edb7087ca3299aaf1',
        '0x29e94e464c7e399aa3a6f40f0aa7b99fe45c3c91bf3981a9e1faed14795d42ff',
        '0x2aa031a0febb7fcec95b29cdf685568b45fdae3194dfd89b1539d8017e722d87',
        '0xf7794359715e664f8ec1261eaca5d25094f30865cb60b20c14ace16daceac282',
        '0x3dc32c041d880085f6e4bea9d7e98ebabd787aab9a390e588c87c04d6a520111',
        '0x6e9a117074d1cd995bca296aac6f24d5b3c02f8d2affbf796dd7b3e15095fd82',
        '0x079ea27414a663ee03ee32ae104c5894f6e1d7c866216d8fbb5dc940fce5f3ed',
        '0x6a9d192a6f2abb384355e8d637e81758f4cc33919e8e450c8958eae416c77bfa',
        '0x097e407e289d42ee9a70895450e2e9f74400b3de4769c19516c1222300c6a880'
      ];
      const merkl = MerklApi('https://api.merkl.xyz').v4;
      try {
        const total = await eoas.reduce(async (accPromise, eoa) => {
          const acc = await accPromise;
          const response = await merkl
            .users({
              address: eoa,
            })
            .rewards.get({
              query: {
                chainId: ['1135'],
              },
            });
          if (response.data.length > 0) {
            const campaigns = response.data[0].rewards[0].breakdowns.filter(
              (breakdown) =>
                campaignsIds.some((id) => id.toLowerCase() === breakdown.campaignId.toLowerCase())
            );

            const eoaTotal = campaigns.reduce((campaignAcc, campaign) => {
              return campaignAcc + BigInt(campaign.claimed);
            }, BigInt(0));

            return acc + Number(formatEther(eoaTotal));
          } else {
            return acc;
          }
        }, Promise.resolve(0));

        return total;
      } catch (error) {
        console.error('Error fetching Lisk Surge data:', error);
        return 0;
      }
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}
