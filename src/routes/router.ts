import { Router } from "express";
import { BadgesServices } from "../services/badges.service";
import {
  SuperChainAccountService,
  superChainAccountService,
} from "../services/superChainAccount.service";
import { ZeroAddress } from "ethers";
import { AttestationsService } from "../services/attestations.service";
import {
  getCurrentSponsorhipValue,
  getMaxGasInUSD,
  isAbleToSponsor,
  relayTransaction,
} from "../services/sponsorship.service";
import privyService from "../services/privy.service";
import { perksService } from "../services/perks.service";
import { UserProfile } from "../types/index.types";
import { verifyOwner } from "../middleware/verifyOwner";
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthSafeTransaction } from '@safe-global/protocol-kit'
import { JSON_RPC_PROVIDER } from "../config/superChain/constants";
import { OperationType, SafeSignature } from "@safe-global/types-kit";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";

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
export default routes;

routes.post("/relay", async (req, res) => {
  const data = req.body;
  const taskId = await relayTransaction(data.to, data.data)
  console.debug({ taskId })
  return res.status(200).json({ taskId })
})


routes.get("/max-weekly-sponsorship", async (req, res) => {
  const headers = req.headers;
  const account = headers.account as string;

  if (!account) {
    return res.status(500).json({ error: "Invalid request" });
  }
  const superChainSmartAccount =
    await superChainAccountService.getSuperChainSmartAccount(account);
  const { maxGasInUSD, gasUsedInUSD } = await getCurrentSponsorhipValue(
    account,
    Number(superChainSmartAccount[3]),
  );

  return res.status(200).json({
    maxGasInUSD,
    gasUsedInUSD,
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
