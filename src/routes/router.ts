import { json, Router } from "express";
import { BadgesServices } from "../services/badges.service";
import {
  SuperChainAccountService,
  superChainAccountService,
} from "../services/superChainAccount.service";
import { ZeroAddress } from "ethers";
import { AttestationsService } from "../services/attestations.service";
import {
  callPimlicoAPI,
  getCurrentSponsorhipValue,
  isAbleToSponsor,
  relayTransaction,
} from "../services/sponsorship.service";
import { perksService } from "../services/perks.service";
import { verifyReverseProxy, verifyOwner } from "../middleware/auth";

const routes = Router();


routes.get("/get-badges", async (req, res) => {
  const headers = req.headers;
  const account = headers.account as string;
  if (!account || account === ZeroAddress) {
    return res.status(500).json({ error: "Invalid request" });
  }

  try {
    const badgesService = new BadgesServices();
    const eoas = await superChainAccountService.getEOAS(account);
    const currentBadges = await badgesService.getBadges(eoas, account);
    res.json({ currentBadges });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

routes.get("/get-user-perks", async (req, res) => {
  const headers = req.headers;
  const account = headers.account as string;
  if (!account || account === ZeroAddress) {
    return res.status(500).json({ error: "Invalid request" });
  }
  const eoas = await superChainAccountService.getEOAS(account);
  const perks = await perksService.getPerks(eoas, account);
  res.json({ perks });
});

routes.get("/get-perks/:level", async (req, res) => {
  const level = parseInt(req.params.level);
  if (isNaN(level)) {
    return res.status(500).json({ error: "Invalid level" });
  }
  const perks = await perksService.getPerksPerLevel(level);
  res.json({ perks });
});

routes.post("/attest-badges", verifyOwner, async (req, res) => {
  const account = req.headers.account as string;
  if (!account) {
    console.error("Invalid request");
    return res.status(500).json({ error: "Invalid request" });
  }
  try {
    const superChainSmartAccount =
      await superChainAccountService.getSuperChainSmartAccount(account);

    const isAble = await isAbleToSponsor(
      account,
      Number(superChainSmartAccount[3]),
    );

    if (!isAble) {
      console.error("User is not able to sponsor");
      return res.status(500).json({ error: "User is not able to sponsor" });
    }

    const badgesService = new BadgesServices();
    const eoas = await superChainAccountService.getEOAS(account);
    const badges = await badgesService.getBadges(eoas, account);
    const attestationsService = new AttestationsService();
    const totalPoints = badgesService.getTotalPoints(badges);
    const badgeUpdates = badgesService.getBadgeUpdates(badges);

    const response = await attestationsService.attest(
      account,
      totalPoints,
      badges,
      badgeUpdates,
    );
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error attesting", error);
    return res.status(500).json({ error });
  }
});

routes.post("/validate-sponsorship", async (req, res) => {
  const requestData = req.body.data.object;
  try {
    const superChainSmartAccount =
      await superChainAccountService.getSuperChainSmartAccount(
        requestData.userOperation.sender,
      );
    const isAble = await isAbleToSponsor(
      requestData.userOperation.sender,
      Number(superChainSmartAccount[3]),
    );
    return res.status(200).json({
      sponsor: isAble,
    });
  } catch (error) {
    console.error("Error validating sponsorship", error);
    return res.status(200).json({
      sponsor: false,
    });
  }
});

routes.post("/relay", async (req, res) => {
  const data = req.body;
  try {
    const superChainSmartAccount =
      await superChainAccountService.getSuperChainSmartAccount(data.to);
    const taskId = await relayTransaction(data.to, data.data, data.to, Number(superChainSmartAccount[3]))
    console.debug({ taskId })
    return res.status(200).json({ taskId })
  } catch (error: any) {
    console.error("Error relaying transaction", error)
    return res.status(500).json({ error: error.message || 'An unknown error occurred' });
  }
})


routes.get("/max-weekly-sponsorship", async (req, res) => {
  const headers = req.headers;
  const account = headers.account as string;

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
});

routes.get("/user", async (req, res) => {
  const headers = req.headers;
  const account = headers.account as string;

  if (!account) {
    return res.status(500).json({ error: "Invalid request" });
  }

  const superchainsmartaccount =
    await superChainAccountService.getSuperChainSmartAccount(account);
  const badges =
    await superChainAccountService.getSuperChainSmartAccountBadges(account);
  const replacer = (key: string, value: any) =>
    typeof value === "bigint" ? value.toString() : value;

  return res.status(200).json(
    JSON.parse(
      JSON.stringify(
        {
          superchainsmartaccount,
          badges,
        },
        replacer,
      ),
    ),
  );
});

routes.post("/pimlico-reverse-proxy", verifyReverseProxy, async (req, res) => {
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

})


export default routes;