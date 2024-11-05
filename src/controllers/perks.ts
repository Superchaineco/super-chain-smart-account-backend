import { Request, Response } from "express";
import { perksService } from "../services/perks.service";
import { ZeroAddress } from "ethers";


export async function perksByLevel(req: Request, res: Response) {
  const level = parseInt(req.params.level);
  if (isNaN(level)) {
    return res.status(500).json({ error: "Invalid level" });
  }
  const perks = await perksService.getPerksPerLevel(level);
  res.json({ perks });
}

export async function perksByAccount(req: Request, res: Response) {
      const account = req.params.account as string;
  if (!account || account === ZeroAddress) {
    return res.status(500).json({ error: "Invalid request" });
  }
  const perks = await perksService.getUserPerks(account);
  res.json({ perks });
}