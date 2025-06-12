import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { BaseBadgeStrategy, DEFAULT_TTL, ExternalApiCall, Seasons } from "./badgeStrategy";
import { Season } from "@/types/index.types";
import { redisService } from "@/services/redis.service";



export class SuperChainTransactionsStrategy extends BaseBadgeStrategy {

    private readonly season = Seasons[0]
    async getValue(eoas: string[]) {

        let totalTxs: number = 0;

        totalTxs += await this.getOP(eoas);
        totalTxs += await this.getBase(eoas);
        totalTxs += await this.getInk(eoas);

        totalTxs += await this.getSoneium(eoas);

        const apiCall: ExternalApiCall = { service: "blockscout", chain: "mode-34443", chainId: "34443", eoas, season: this.season }
        apiCall.fromBlock = apiCall.season.blockRanges[apiCall.chain][0];
        apiCall.toBlock =
            Date.now() >= this.season.toDate.getTime()
                ? '&to_block=' + apiCall.season.blockRanges[apiCall.chain][1]
                : '';

        totalTxs += await this.getCachedValue(apiCall);
        totalTxs += await this.getUnichain(eoas);
        return totalTxs;
    }


    async getBase(eoas: string[]): Promise<number> {
        const chain = "base-8453";
        const cacheKey = `baseTransactions-S7-${eoas.join(",")}`;
        const season = this.season;

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.BASE_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= this.season.toDate.getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                // const incomingResult = await alchemy.core.getAssetTransfers({
                //     fromBlock: season.blockRanges[chain][0],
                //     toBlock: toBlock,
                //     toAddress: eoa,
                //     excludeZeroValue: false,
                //     category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                // });

                return acc + outgoingResult.transfers.length //+ incomingResult.transfers.length;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, DEFAULT_TTL);
    }


    async getInk(eoas: string[]): Promise<number> {
        const chain = "ink-57073";
        const cacheKey = `inkTransactions-S7-${eoas.join(",")}`;
        const season = this.season;

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.INK_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= this.season.toDate.getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                // const incomingResult = await alchemy.core.getAssetTransfers({
                //     fromBlock: season.blockRanges[chain][0],
                //     toBlock: toBlock,
                //     toAddress: eoa,
                //     excludeZeroValue: false,
                //     category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                // });

                return acc + outgoingResult.transfers.length //+ incomingResult.transfers.length;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, DEFAULT_TTL);

    }

    async getUnichain(eoas: string[]): Promise<number> {
        const chain = "unichain-130";
        const cacheKey = `unichainTransactions-S7-${eoas.join(",")}`;
        const season = this.season;

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.UNICHAIN_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= this.season.toDate.getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                // const incomingResult = await alchemy.core.getAssetTransfers({
                //     fromBlock: season.blockRanges[chain][0],
                //     toBlock: toBlock,
                //     toAddress: eoa,
                //     excludeZeroValue: false,
                //     category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                // });

                return acc + outgoingResult.transfers.length //+ incomingResult.transfers.length;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, DEFAULT_TTL);

    }

    async getSoneium(eoas: string[]): Promise<number> {
        const chain = "Soneium";
        const cacheKey = `soneiumTransactions-S7-${eoas.join(",")}`;
        const season = this.season;

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.SONEIUM_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= this.season.toDate.getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                // const incomingResult = await alchemy.core.getAssetTransfers({
                //     fromBlock: season.blockRanges[chain][0],
                //     toBlock: toBlock,
                //     toAddress: eoa,
                //     excludeZeroValue: false,
                //     category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                // });

                return acc + outgoingResult.transfers.length //+ incomingResult.transfers.length;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, DEFAULT_TTL);

    }

    async getOP(eoas: string[]): Promise<number> {
        const chain = "optimism-10";
        const cacheKey = `optimismTransactions-S7-${eoas.join(",")}`;
        const season = this.season;

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.OPT_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= this.season.toDate.getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                // const incomingResult = await alchemy.core.getAssetTransfers({
                //     fromBlock: season.blockRanges[chain][0],
                //     toBlock: toBlock,
                //     toAddress: eoa,
                //     excludeZeroValue: false,
                //     category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                // });

                return acc + outgoingResult.transfers.length //+ incomingResult.transfers.length;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, DEFAULT_TTL);

    }

}