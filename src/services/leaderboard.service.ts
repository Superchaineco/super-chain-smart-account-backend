
import { DUNE_API_KEY } from "@/config/superChain/constants";
import { DuneClient } from "@duneanalytics/client-sdk";
import { redisService } from "./redis.service";
import { redis } from "@/utils/cache";

export class LeaderBoardService {
    private readonly dune: DuneClient;
    private readonly cacheKey = "leaderboard_list";
    private readonly ttl = 86400; // 24 hours

    constructor() {
        this.dune = new DuneClient(DUNE_API_KEY);
    }


    public async refreshLeaderBoardCache(): Promise<void> {
        const allRows = await this.fetchAllRows();

        const pipeline = redis.multi();

        pipeline.del(this.cacheKey);
        pipeline.del(`${this.cacheKey}_zset`);

        allRows.forEach((row, index) => {
            pipeline.rpush(this.cacheKey, JSON.stringify(row));
            pipeline.zadd(`${this.cacheKey}_zset`, index, row.superaccount.toLowerCase());
        });
        pipeline.expire(this.cacheKey, this.ttl);
        pipeline.expire(`${this.cacheKey}_zset`, this.ttl);

        const rankKeysPattern = `leaderboard_rank:*`;
        const rankKeys = await redis.keys(rankKeysPattern);
        if (rankKeys.length > 0) {
            pipeline.del(...rankKeys);
        }


        await pipeline.exec();
    }

    public async getPaginatedLeaderBoard(page: number = 1, pageSize: number = 20): Promise<{ data: any[]; hasNextPage: boolean }> {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize - 1;

        const exists = await redis.exists(this.cacheKey);
        if (!exists) {
            console.log("Cache miss, refreshing leaderboard cache...");
            await this.refreshLeaderBoardCache();
        }

        const rows = await redis.lrange(this.cacheKey, startIndex, endIndex);
        const hasNextPage = (await redis.llen(this.cacheKey)) > endIndex;

        console.log("rows", rows.length);
        return {
            data: rows.map(row => JSON.parse(row)),
            hasNextPage,
        };
    }

    public async getRank(superaccount: string): Promise<{ rank: number; data: any } | null> {
        const rankCacheKey = `leaderboard_rank:${superaccount.toLowerCase()}`;

        const ttl = await redis.ttl(this.cacheKey);

        const fetchFunction = async () => {
            const zsetKey = `${this.cacheKey}_zset`;

            const cachedRank = await redisService.getCachedData(rankCacheKey);
            if (cachedRank) {
                console.log(`Cache hit for rank of ${superaccount}`);
                return cachedRank;
            }

            const zsetExists = await redis.exists(zsetKey);
            if (!zsetExists) {
                console.log("ZSET cache miss, refreshing leaderboard cache...");
                await this.refreshLeaderBoardCache();
            }

            const rank = await redis.zrank(`${this.cacheKey}_zset`, superaccount.toLowerCase());
            if (rank === null) {
                return null;
            }

            const row = await redis.lindex(this.cacheKey, rank);
            if (!row) {
                return null;
            }

            return { rank: rank + 1, data: JSON.parse(row) };
        }

        return redisService.getCachedDataWithCallback(rankCacheKey, fetchFunction, ttl);

    }

    private async fetchAllRows(): Promise<any[]> {
        const queryId = 4432290;
        const limit = 10000;
        let offset = 0;
        let allRows: any[] = [];

        do {
            const result = await this.dune.getLatestResult({ queryId, limit, offset });
            offset = result.next_offset;
            const { rows } = result.result;
            const cleanedRows = this.cleanData(rows);

            allRows = [...allRows, ...cleanedRows];
        } while (offset);

        return allRows;
    }

    private cleanData(rows: any[]): any[] {
        return rows.map(row => {
            const addressMatch = row.superaccount.match(/0x[a-fA-F0-9]{40}/);
            const address = addressMatch ? addressMatch[0] : row.superaccount;

            return {
                ...row,
                superaccount: address,
            };
        });
    }



}


