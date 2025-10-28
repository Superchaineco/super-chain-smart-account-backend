import { Request, Response } from "express";
import { AirdropService } from "@/services/airdrop.service";


export async function postAirdrop(req: Request, res: Response) {
  // explicit types
  const account: string = req.params.account as string;
  const airdropId: string = req.body.airdropId as string;
  const txHash: string = req.body.txHash as string;

  // Basic validations (keep controller thin: input validation + mapping service result to HTTP)
  if (!txHash) return res.status(400).json({ error: "Transaction hash is required" });
  if (!airdropId) return res.status(400).json({ error: "airdropId is required" });
  if (!account) return res.status(400).json({ error: "account is required" });

  const service: AirdropService = new AirdropService();

  try {
    const result = await service.updateRecipientHash({
      account,
      airdropId,
      txHash,
    });

    if (!result.found) {
      return res.status(404).json({ error: "Account not found" });
    }

    return res.status(200).json({
      message: "Airdrop recipient updated successfully",
      recipient: result.updatedRowHash, // mirrors previous response
    });
  } catch (error) {
    // Do not leak internals
    // eslint-disable-next-line no-console
    console.error("Error updating airdrop_recipients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAirdrop(req: Request, res: Response) {
  const account: string = req.params.account as string;

  if (!account) return res.status(400).json({ error: "Invalid request" });

  const service: AirdropService = new AirdropService();

  try {
    const response = await service.fetchAirdropForAccount({
      account
    }, 1);

    return res.status(200).json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting airdrop:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
