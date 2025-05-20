import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { BaseBadgeStrategy } from "./badgeStrategy";
import { Season } from "@/types/index.types";
import { redisService } from "@/services/redis.service";



export class SuperChainTransactionsStrategy extends BaseBadgeStrategy {


    async getValue(eoas: string[]) {
        const season = this.getSeason();

        const requests: Promise<number>[] = [
            this.getOP(eoas),
            this.getBase(eoas),
            this.getInk(eoas),
            this.getUnichain(eoas),
            this.getSoneium(eoas),            
            this.getCachedSeasonedValue({ service: "routescan", chain: "mode-34443", chainId: "34443", eoas, season }),
        ];

        const results: number[] = await Promise.all(requests);
        const totalTxs: number = results.reduce((acc, curr) => acc + curr, 0);

        return totalTxs;
    }

    async getBase(eoas: string[]): Promise<number> {
        const chain = "base-8453";
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
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                const incomingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
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


    async getInk(eoas: string[]): Promise<number> {
        const chain = "ink-57073";
        const cacheKey = `inkTransactions-S7-${eoas.join(",")}`;
        const season = this.getSeason();

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.INK_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= new Date(2025, 5, 11).getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                const incomingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
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

    async getUnichain(eoas: string[]): Promise<number> {
        const chain = "unichain-130";
        const cacheKey = `unichainTransactions-S7-${eoas.join(",")}`;
        const season = this.getSeason();

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.UNICHAIN_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= new Date(2025, 5, 11).getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                const incomingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
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

    async getSoneium(eoas: string[]): Promise<number> {
        const chain = "Soneium";
        const cacheKey = `soneiumTransactions-S7-${eoas.join(",")}`;
        const season = this.getSeason();

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.SONEIUM_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= new Date(2025, 5, 11).getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                const incomingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
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

    async getOP(eoas: string[]): Promise<number> {
        const chain = "optimism-10";
        const cacheKey = `optimismTransactions-S7-${eoas.join(",")}`;
        const season = this.getSeason();

        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: Network.OPT_MAINNET,
            };
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, eoa) => {
                const acc = await accPromise;

                const toBlock = Date.now() >= new Date(2025, 5, 11).getTime()
                    ? season.blockRanges[chain][1]
                    : null;
                const outgoingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
                    toBlock: toBlock,
                    fromAddress: eoa,
                    excludeZeroValue: false,
                    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20, AssetTransfersCategory.ERC1155]
                });

                const incomingResult = await alchemy.core.getAssetTransfers({
                    fromBlock: season.blockRanges[chain][0],
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