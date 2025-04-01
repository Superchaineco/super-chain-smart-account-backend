import http from 'http';
import app from './app';
import * as logger from './utils/logger';
import cron from 'node-cron';
import { LeaderBoardService } from './services/leaderboard.service';
import { ENV, ENVIRONMENTS } from './config/superChain/constants';

if (ENV === ENVIRONMENTS.production) {
  cron.schedule('30 13 * * 0', async () => {
    try {
      const leaderboardService = new LeaderBoardService();
      await leaderboardService.refreshLeaderBoardCache();
      console.log('✅✅✅✅✅✅✅✅✅✅✅ Leaderboard cache refreshed✅✅✅✅✅✅✅✅✅✅✅✅');
    } catch (error) {
      console.error('🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥Error refreshing leaderboard cache:', error);
    }

  });
}
const server = http.createServer(app);


const PORT = process.env.PORT || 3003;


server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

server.setTimeout(500000);
