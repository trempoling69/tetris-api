import { Module } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';
import { LeaderboardsController } from './leaderboards.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Game } from 'src/games/entities/game.entity';

@Module({
  imports: [SequelizeModule.forFeature([Game])],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
})
export class LeaderboardsModule {}
