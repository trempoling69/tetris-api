import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    AchievementsModule,
    GamesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
