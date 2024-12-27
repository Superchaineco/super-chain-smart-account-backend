import { Request, Response } from "express";
import { LeaderBoardService } from "@/services/leaderboard.service";

export async function rankByAccount(req: Request, res: Response) {
    const account = req.params.account as string;
    const leaderBoardService = new LeaderBoardService();

    try {
        const rank = await leaderBoardService.getRank(account);
        res.json(rank);
    } catch (error) {
        console.error("Error fetching rank by account:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function paginatedLeaderboard(req: Request, res: Response) {
    let page = parseInt(req.query.page as string);
    if (isNaN(page)) page = 1;
    const leaderBoardService = new LeaderBoardService();

    try {
        const data = await leaderBoardService.getPaginatedLeaderBoard(page);
        res.json(data);
    } catch (error) {
        console.error("Error fetching paginated leaderboard:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}