import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { BaseBadgeStrategy } from "./badgeStrategy";
import { Season } from "@/types/index.types";
import { redisService } from "@/services/redis.service";



const seasons: Season[] = [
    {
        season: "S7",
        fromDate: new Date(2025, 0, 16),
        toDate: new Date(2025, 5, 11),
        blockRanges: {
            "optimism-10": [130693412, 137000612],//2 secs x block
            "base-8453": [25098127, 31405327], //2 secs x block
            "unichain-130": [10151172, 22765572], //1 sec x block
            "mode-34443": [18418009, 24725209], //2 secs x block
            "ink-57073": [3505189, 16119589],//1 sec x block
            "Soneium": [1934425, 8241625], //2 secs x block
            //Not relevante yet
            "mint-185": [0, 0],
            "swell-1923": [0, 0],
            "Metal": [0, 0]
        }
    }
]




export class SuperChainTransactionsStrategy extends BaseBadgeStrategy {

    getSeason(): Season {
        return seasons.find(season => season.fromDate < new Date() && season.toDate > new Date());
    }
    async getValue(eoas: string[]) {
        const season = this.getSeason();

        const requests: Promise<number>[] = [
            this.getCachedSeasonedValue({ service: "blockscout", chain: "optimism-10", chainId: "10", eoas, season }),
            // this.getCachedSeasonedValue({ service: "blockscout", chain: "base-8453", chainId: "8453", eoas, season }),
            this.getBase(eoas),
            this.getCachedSeasonedValue({ service: "blockscout", chain: "ink-57073", chainId: "57073", eoas, season }),
            this.getCachedSeasonedValue({ service: "blockscout", chain: "unichain-130", chainId: "130", eoas, season }),
            this.getCachedSeasonedValue({ service: "blockscout", chain: "Soneium", chainId: "", eoas, season }),
            this.getCachedSeasonedValue({ service: "routescan", chain: "mode-34443", chainId: "34443", eoas, season }),
        ];

        const results: number[] = await Promise.all(requests);
        const totalTxs: number = results.reduce((acc, curr) => acc + curr, 0);

        return totalTxs;
    }

    async getBase(eoas: string[]): Promise<number> {
        const cacheKey = `baseTransactions-S7-${eoas.join(",")}`;
        const season = this.getSeason();

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.BASE_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= new Date(2025, 5, 11).getTime()
                    ? season.blockRanges["base-8453"][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges["base-8453"][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                const incomingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges["base-8453"][0],
                    toBlock: toBlock,
                    toAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                return acc + outgoingResult.transfers.length + incomingResult.transfers.length;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, 3600);
    }

}