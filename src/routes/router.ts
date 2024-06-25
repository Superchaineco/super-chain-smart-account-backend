import { Router } from 'express';
import { BadgesServices } from '../services/badges.service';
import { superChainAccountService } from '../services/superChainAccount.service';
import { ZeroAddress } from 'ethers';
import { AttestationsService } from '../services/attestations.service';


const routes = Router();

// routes.post('/', async (req, res) => {
//   const attestationsService = new AttestationsService();
//   const response = await attestationsService.attest('0x1726cf86DA996BC4B2F393E713f6F8ef83f2e4f6', [], [{
//     badgeId: 1,level: 1
//   }]);
//   return res.json(response);
// });

routes.get('/get-badges', async (req, res) => {
  const headers = req.headers;
  const account = headers.account as string;
  if (!account || account === ZeroAddress) {
    return res.status(500).json({ error: 'Invalid request' });
  }
  
  try {
    const badgesService = new BadgesServices();
    // const eoas = await superChainAccountService.getEOAS(account);
    const currentBadges = await badgesService.getBadges([account], account);
  //   const totalPoints = badgesService.getTotalPoints(currentBadges);
    res.json({ currentBadges });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

// routes.put('/badge', async (req, res) => {
//   let query = req.query;
//   if (!query.badgeid || !query.account) {
//     return res.status(500).json({ error: 'Invalid request' });
//   }
//   const badgeId = query.badgeid as string;
//   const account = query.account as string;
//   delete query.badgeid;
//   delete query.account;
//   try {
//     const badgesService = new BadgesServices();
//     const badge = await badgesService.updateBadge(account, badgeId, query);
//     return res.json(badge);
//   } catch (error) {
//     return res.json({ error });
//   }
// });

// routes.post('/attest-badges', async (req, res) => {
//   const headers = req.headers;
//   const account = headers.account as string;
//   if (!account) {
//     return res.status(500).json({ error: 'Invalid request' });
//   }
//   const badgesService = new BadgesServices();
//   const eoas = await superChainAccountService.getEOAS(account);
//   const badges = await badgesService.getBadges(eoas, account);
//   const claimablePoints = badgesService.getClaimablePoints(badges);
//   const attestationsService = new AttestationsService();
//   try {
//     // const response = await attestationsService.attest(
//     //   account,
//     //   claimablePoints,
//     //   badges,
//     //   badges
//     //     .filter((badge) => badge.claimableTier)
//     //     .map((badge) => {
//     //       return (badge.tiers as Tiers[])[badge.claimableTier!]['2DImage'];
//     //     })
//     // );
//     return res.status(201)
//   } catch (error) {
//     console.error('Error attesting', error);
//     return res.status(500).json({ error });
//   }
// });
export default routes;
