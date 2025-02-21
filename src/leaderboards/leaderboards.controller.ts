import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get('/bestScore')
  bestScoreLeaderboard(
    @Query('limit') limit: string = '10',
    @Query('period') period: string = 'all-time',
  ) {
    return this.leaderboardsService.getByBestScores(+limit, period);
  }

  @Get('/totalScore')
  totalScoreLeaderboard(
    @Query('limit') limit: string = '10',
    @Query('period') period: string = 'all-time',
  ) {
    return this.leaderboardsService.getByTotalScores(+limit, period);
  }
}
