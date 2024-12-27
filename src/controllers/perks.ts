import { Request, Response } from "express";
import { perksService } from "../services/perks.service";
import { ZeroAddress } from "ethers";


export async function perksByLevel(req: Request, res: Response) {
  const level = parseInt(req.params.level);
  if (isNaN(level)) {
    return res.status(500).json({ error: "Invalid level" });
  }

  try {
    const perks = await perksService.getPerksPerLevel(level);
    res.json({ perks });
  } catch (error) {
    console.error("Error fetching perks by level:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function perksByAccount(req: Request, res: Response) {
  const account = req.params.account as string;
  if (!account || account === ZeroAddress) {
    return res.status(500).json({ error: "Invalid request" });
  }

  try {
    const perks = await perksService.getUserPerks(account);
    res.json({ perks });
  } catch (error) {
    console.error("Error fetching perks by account:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}