import { Request, Response } from 'express';
import { castToUserIdentifier } from '@selfxyz/common/utils/circuits/uuid';
import { SelfService } from '@/services/self.service';
import { pgPool } from '@/config/db';

export default async function selfVerify(req: Request, res: Response) {
  if (req.method === 'POST') {
    const { attestationId, proof, publicSignals, userContextData } = req.body;


    console.log('Verification recieved info:', req.body);
    if (!proof || !publicSignals) {
      return res
        .status(400)
        .json({ message: 'Proof and publicSignals are required' });
    }

    const selfService = new SelfService();
    const userIdentifier = castToUserIdentifier(
      BigInt('0x' + userContextData.slice(64, 128)),
      'uuid'
    );

    try {
      const result = await selfService.selfVerify(
        userIdentifier,
        proof,
        publicSignals,
        attestationId,
        userContextData
      );
      console.log('Verification result:', result);

      if (result.isValid) {
        return res.status(200).json({
          status: 'success',
          result: true,
          credentialSubject: result.credentialSubject,
        });
      } else {
        return res.status(500).json({
          status: 'error',
          result: false,
          message: 'Verification failed',
          details: result.details,
        });
      }
    } catch (error) {
      console.error('Error verifying proof:', error);
      return res.status(500).json({
        status: 'error',
        result: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

export async function selfCheck(req: Request, res: Response) {
  const selfService = new SelfService();
  const response = await selfService.selfCheck(
    req.query.userId as string,
    req.query.account as string
  );

  if (response.check) {
    return res.status(200).json(response);
  }
  return res.status(200).json(response);
}

interface NationalityResponse {
  [address: string]: string;
}

export async function getNationalitiesBatch(req: Request, res: Response) {
  
  try {
    const { addresses } = req.body;

    if (!Array.isArray(addresses)) {
      return res.status(400).json({
        error: 'Bad request',
      });
    }

    const processedAddresses = Array.from(
      new Set(
        addresses
          .filter((address) => typeof address === 'string')
          .map((address) => address.trim().toUpperCase())
      )
    );

    if (processedAddresses.length === 0) {
      return res.status(400).json({
        error: 'Bad request',
      });
    }

    console.log('Processed addresses:', processedAddresses);
    const lowerAddresses = processedAddresses.map((a) => a.toLowerCase());

    type Row = { account: string; nationality: string | null };

    const { rows } = await pgPool.query<Row>(
      `
  SELECT account, nationality
  FROM public.super_accounts
  WHERE lower(account) = ANY($1::text[])
  `,
      [lowerAddresses]
    );

    // Mapeamos por lower(account) para lookup rápido
    const byAccount = new Map<string, string | null>(
      rows.map((r) => [r.account.toLowerCase(), r.nationality])
    );

    const responseData: NationalityResponse = {};

    processedAddresses.forEach((address) => {
      const nat = byAccount.get(address.toLowerCase());
      if (nat) {
        // conservamos la clave con el address procesado (mayúsculas en tu flujo actual)
        responseData[address] = nat;
      }
    });

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal error',
    });
  }
  
}
