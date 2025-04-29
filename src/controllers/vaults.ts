import { Request, Response } from "express";
import { getVaultsAPR, refreshVaultsCache } from "../services/vaults.service";

export async function getVaults(req: Request, res: Response) {
  const account = req.params.account as string;
  const vaults = await getVaultsAPR(account);
  res.status(200).json(vaults);
}

export async function refreshVaults(req: Request, res: Response) {
  const account = req.params.account as string;
  await refreshVaultsCache(account)
  res.status(200)
}

