import { getCampaignDetails, Campaign } from '../services/campaigns/campaigns.service';
import campaignsData from '../services/campaigns/campaigns.json';

export const getCampaigns = async (req, res) => {
  const { account } = req.params;
  try {
    const campaigns: Campaign[] = campaignsData as unknown as Campaign[];
    const details = await Promise.all(
      campaigns.map((c) => getCampaignDetails(account, c.id))
    );
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : error });
  }
}; 