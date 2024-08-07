import { Router } from "express";
import { BadgesServices } from "../services/badges.service";
import { superChainAccountService } from "../services/superChainAccount.service";
import { ZeroAddress } from "ethers";
import { AttestationsService } from "../services/attestations.service";
import {
  getCurrentSponsorhipValue,
  getMaxGasInUSD,
  isAbleToSponsor,
} from "../services/sponsorship.service";

const routes = Router();

// routes.post('/', async (req, res) => {
//   const attestationsService = new AttestationsService();
//   const response = await attestationsService.attest('0x1726cf86DA996BC4B2F393E713f6F8ef83f2e4f6', [], [{
//     badgeId: 1,level: 1
//   }]);
//   return res.json(response);
// });

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

routes.post("/attest-badges", async (req, res) => {
  const headers = req.headers;
  const account = headers.account as string;
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

