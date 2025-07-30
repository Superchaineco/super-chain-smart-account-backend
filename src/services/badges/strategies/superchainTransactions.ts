import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { BaseBadgeStrategy, CHAIN_KEYS, DEFAULT_TTL, ExternalApiCall, NETWORKS } from "./badgeStrategy";
import { Season } from "@/types/index.types";
import { redisService } from "@/services/redis.service";




export class SuperChainTransactionsStrategy extends BaseBadgeStrategy {
    constructor(private readonly season: Season) {
        super();
    }

    async getValue(eoas: string[]): Promise<number> {
        const season = this.season;
        let totalTxs = 0;

        totalTxs += await this.getAlchemyTransactionsCount(CHAIN_KEYS.OPTIMISM, NETWORKS[CHAIN_KEYS.OPTIMISM], eoas);
        totalTxs += await this.getAlchemyTransactionsCount(CHAIN_KEYS.BASE, NETWORKS[CHAIN_KEYS.BASE], eoas);
        totalTxs += await this.getAlchemyTransactionsCount(CHAIN_KEYS.INK, NETWORKS[CHAIN_KEYS.INK], eoas);
        totalTxs += await this.getAlchemyTransactionsCount(CHAIN_KEYS.SONEIUM, NETWORKS[CHAIN_KEYS.SONEIUM], eoas);
        totalTxs += await this.getAlchemyTransactionsCount(CHAIN_KEYS.UNICHAIN, NETWORKS[CHAIN_KEYS.UNICHAIN], eoas);

        const apiCall: ExternalApiCall = {
            service: "blockscout",
            chain: CHAIN_KEYS.MODE,
            chainId: "34443",
            eoas,
            season,
        };

        apiCall.fromBlock = season.blockRanges[apiCall.chain][0];
        apiCall.toBlock = Date.now() >= season.toDate.getTime()
            ? '&to_block=' + season.blockRanges[apiCall.chain][1]
            : '';

        totalTxs += await this.getCachedValue(apiCall);

        return totalTxs;
    }

    private async getAlchemyTransactionsCount(
        chainKey: string,
        network: Network,
        eoas: string[]
    ): Promise<number> {
        const cacheKey = `${chainKey}-transactions-${this.season.season}-${eoas.join(",")}`;
        const season = this.season;

        const fetchFunction = async (): Promise<number> => {
            const alchemy = new Alchemy({
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network,
            });

            const fromBlockNum: number = season.blockRanges[chainKey][0];
            const toBlockNum: number = season.blockRanges[chainKey][1];
            const currentBlock: number = await alchemy.core.getBlockNumber();

            if (currentBlock < fromBlockNum) {
                return 0;
            }

            const fromBlockHex = `0x${fromBlockNum.toString(16)}`;
            const toBlockHex = `0x${toBlockNum.toString(16)}`;
            const useToBlock = currentBlock >= toBlockNum;


            const count = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;
                const result = await alchemy.core.getAssetTransfers({
                    fromBlock: fromBlockHex,
                    toBlock: useToBlock ? toBlockHex : undefined,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [
                        AssetTransfersCategory.EXTERNAL,
                        AssetTransfersCategory.ERC20,
                        AssetTransfersCategory.ERC1155,
                    ],
                });
                return acc + result.transfers.length;
            }, Promise.resolve(0));

            return count;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, DEFAULT_TTL);
    }
}
