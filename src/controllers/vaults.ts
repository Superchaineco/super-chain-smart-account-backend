import { Request, Response } from "express";
import { getVaultsAPR  } from "../services/vaults.service";

export async function getVaults(req: Request, res: Response) {
  const vaults = await getVaultsAPR();
  res.status(200).json(vaults);
}

