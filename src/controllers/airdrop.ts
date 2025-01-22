import { AirdropService } from '@/services/airdrop.service';
import { Request, Response } from 'express';

export async function getAirdrop(req: Request, res: Response) {
  const account = req.params.account as string;

  if (!account) {
    return res.status(500).json({ error: 'Invalid request' });
  }

  const airdropService = new AirdropService();
  const airdropData = await airdropService.getAirdropData(account);
  res.status(200).json(airdropData);
}
