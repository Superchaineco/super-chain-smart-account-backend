import { LeaderBoardService } from '@/services/leaderboard.service';

(async () => {
  try {
    const leaderboardService = new LeaderBoardService();
   // await leaderboardService.refreshLeaderBoardCache();
    console.log('✅ Leaderboard cache refreshed');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
