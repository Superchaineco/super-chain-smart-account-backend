import { Request, Response } from "express";
import { getVaultsAPR } from "../services/vaults.service";

export async function getVaults(req: Request, res: Response) {
  const account = req.params.account as string;
  const vaults = await getVaultsAPR(account);
  res.status(200).json(vaults);
}

