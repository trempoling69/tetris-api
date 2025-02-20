import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Achievement } from './entities/achievement.entity';

@Module({
  imports: [SequelizeModule.forFeature([Achievement])],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
