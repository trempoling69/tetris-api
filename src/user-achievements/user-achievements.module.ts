import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserAchievement } from './entities/user-achievements.entity';

@Module({
  imports: [SequelizeModule.forFeature([UserAchievement])],
})
export class UserAchievementsModule {}
