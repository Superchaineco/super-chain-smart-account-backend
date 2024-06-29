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
    res.json({ currentBadges });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
});

routes.post('/attest-badges', async (req, res) => {

  const headers = req.headers;
  const account = headers.account as string;
  if (!account) {
    return res.status(500).json({ error: 'Invalid request' });
  }
  const badgesService = new BadgesServices();
  const eoas = await superChainAccountService.getEOAS(account);
  const badges = await badgesService.getBadges(eoas, account);
  const attestationsService = new AttestationsService();
  const totalPoints = badgesService.getTotalPoints(badges)
  const badgeUpdates = badgesService.getBadgeUpdates(badges)

  try {
    const response = await attestationsService.attest(
      account,
      totalPoints,
      badges,
      badgeUpdates

    );
    return res.status(201)
      .json(response)
  } catch (error) {
    console.error('Error attesting', error);
    return res.status(500).json({ error });
  }
});
export default routes;
