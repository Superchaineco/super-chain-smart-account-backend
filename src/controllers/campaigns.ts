import {
  getCampaignDetailsWithData,
  Campaign,
  CampaignBadge,
} from '../services/campaigns/campaigns.service';
import campaignsData from '../services/campaigns/campaigns.json';
import { superChainAccountService } from '../services/superChainAccount.service';
import { BadgesServices } from '../services/badges/badges.service';

const badgesService = new BadgesServices();

export const getCampaigns = async (req, res) => {
  const { account } = req.params;
  try {
    // Obtener los datos una sola vez
    const eoas = await superChainAccountService.getEOAS(account);
    const userBadges = await badgesService.getBadges(eoas, account);


    const superAccountLevel = await superChainAccountService.getAccountLevel(
      account
    );

    const campaigns: Campaign[] = campaignsData as unknown as Campaign[];
    const details = await Promise.all(
      campaigns.map((c: Campaign) =>
        getCampaignDetailsWithData(c.id, {
          eoas,
          userBadges,
          superAccountLevel,
        }, c, account)
      )
    );
    res.json(details);
  } catch (error) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : error });
  }
};
