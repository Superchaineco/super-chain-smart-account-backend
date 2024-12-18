
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

        allRows.forEach(row => {
            pipeline.rpush(this.cacheKey, JSON.stringify(row));
        });

        pipeline.expire(this.cacheKey, this.ttl);

        await pipeline.exec();
    }

    public async getPaginatedLeaderBoard(page: number = 1, pageSize: number = 20): Promise<any[]> {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize - 1;

        const exists = await redis.exists(this.cacheKey);
        if (!exists) {
            console.log("Cache miss, refreshing leaderboard cache...");
            await this.refreshLeaderBoardCache();
        }

        const rows = await redis.lrange(this.cacheKey, startIndex, endIndex);
        console.log("rows", rows.length);
        return rows.map(row => JSON.parse(row));
    }

    public async getRank(superaccount: string): Promise<{ rank: number; data: any } | null> {
        const rankCacheKey = `leaderboard_rank:${superaccount.toLowerCase()}`; 

        const cachedRank = await redisService.getCachedData(rankCacheKey);
        if (cachedRank) {
            console.log(`Cache hit for rank of ${superaccount}`);
            return cachedRank;
        }
    
        const allRows = await this.getAllRowsFromCache();
    
        const rank = allRows.findIndex(row => row.superaccount.toLowerCase() === superaccount.toLowerCase());
        if (rank === -1) {
            return null;
        }
    
        const result = { rank: rank + 1, data: allRows[rank] };
    
        const ttl = await redis.ttl(this.cacheKey);
        if (ttl > 0) {
            await redisService.setCachedData(rankCacheKey, result, ttl);
        }
    
        return result;
    }

    private async getAllRowsFromCache(): Promise<any[]> {
        const exists = await redis.exists(this.cacheKey);
        if (!exists) {
            console.log("Cache miss, refreshing leaderboard cache...");
            await this.refreshLeaderBoardCache();
        }

        const rows = await redis.lrange(this.cacheKey, 0, -1);
        return rows.map(row => JSON.parse(row));
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

export const leaderBoardService = new LeaderBoardService();

