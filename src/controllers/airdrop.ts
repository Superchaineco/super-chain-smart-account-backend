import { SUNNY_TOKEN_ADDRESS } from '@/config/superChain/constants';
import { AirdropService } from '@/services/airdrop.service';
import { Request, Response } from 'express';

export async function getAirdrop(req: Request, res: Response) {
  const account = req.params.account as string;

  if (!account) {
    return res.status(500).json({ error: 'Invalid request' });
  }
  try {
    const airdropService = new AirdropService();
    const airdropData = await airdropService.getAirdropData(
      account.toLowerCase()
    );
    const isClaimed = await airdropService.isAirdropClaimed(
      account,
      SUNNY_TOKEN_ADDRESS
    );

    const eligible = airdropData && airdropData.inputs[1] > 0;
    const response = eligible
      ? {
          eligible: true,
          address: airdropData.inputs[0],
          value: airdropData.inputs[1],
          proofs: airdropData.proof,
          claimed: isClaimed,
          reasons: airdropData.reasons,
        }
      : {
          eligible: false,
          address: '0x0000000000000000000000000000000000000000',
          value: '0',
          proofs: [],
          claimed: false,
          reasons: [],
        };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
