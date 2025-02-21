import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';
import { ResponseMessage } from 'src/decorator/response.message.decorator';

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get('/bestScore')
  @ResponseMessage('Récupération des meilleurs joueurs par meilleurs score')
  bestScoreLeaderboard(
    @Query('limit') limit: string = '10',
    @Query('period') period: string = 'all-time',
  ) {
    return this.leaderboardsService.getByBestScores(+limit, period);
  }

  @Get('/totalScore')
  @ResponseMessage('Récupération des meilleurs joueurs par score total')
  totalScoreLeaderboard(
    @Query('limit') limit: string = '10',
    @Query('period') period: string = 'all-time',
  ) {
    return this.leaderboardsService.getByTotalScores(+limit, period);
  }
}
