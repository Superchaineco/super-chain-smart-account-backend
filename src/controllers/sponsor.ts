import { Request, Response } from "express";
import { superChainAccountService } from "../services/superChainAccount.service";
import { callPimlicoAPI, getCurrentSponsorhipValue, relayTransaction } from "../services/sponsorship.service";

export async function getBalance(req: Request, res: Response) {
  const account = req.params.account as string;

  if (!account) {
    return res.status(500).json({ error: "Invalid request" });
  }
  const superChainSmartAccount =
    await superChainAccountService.getSuperChainSmartAccount(account);
  const { relayedTransactions, maxRelayedTransactions } = await getCurrentSponsorhipValue(
    account,
    Number(superChainSmartAccount[3]),
  );
  return res.status(200).json({
    relayedTransactions,
    maxRelayedTransactions,
  });
}

export async function validateSponsorship(req: Request, res: Response) {
  const requestData = req.body.data.object;
  try {
    // const superChainSmartAccount =
    //   await superChainAccountService.getSuperChainSmartAccount(
    //     requestData.userOperation.sender,
    //   );
    // const isAble = await isAbleToSponsor(
    //   requestData.userOperation.sender,
    //   Number(superChainSmartAccount[3]),
    // );
    return res.status(200).json({
      sponsor: true,
    });
  } catch (error) {
    console.error("Error validating sponsorship", error);
    return res.status(200).json({
      sponsor: false,
    });
  }
}


export async function relay(req: Request, res: Response) {
  const data = req.body;
  try {
    const superChainSmartAccount =
      await superChainAccountService.getSuperChainSmartAccount(data.to);
    const taskId = await relayTransaction(data.to, data.data, data.to, Number(superChainSmartAccount[3]))
    return res.status(200).json({ taskId })
  } catch (error: any) {
    console.error("Error relaying transaction", error)
    return res.status(500).json({ error: error.message || 'An unknown error occurred' });
  }
}

export async function reverseProxy(req: Request, res: Response){

  try {
    const { jsonrpc, method, params, id } = req.body;
    const response = await callPimlicoAPI({ jsonrpc, method, params, id });
    if (response.error) throw response.error;
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: error.message || "An unknown error occurred",
      },
      id: error.id || null,
    });
  }
}