import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { AchievementsModule } from 'src/achievements/achievements.module';

@Module({
  imports: [SequelizeModule.forFeature([Game]), AchievementsModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
