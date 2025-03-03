import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthentificationModule } from './authentification/authentification.module';
import { GamesModule } from './games/games.module';
import { AchievementsModule } from './achievements/achievements.module';
import { UserAchievementsModule } from './user-achievements/user-achievements.module';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { DuelsModule } from './duels/duels.module';
import databaseConfig from './sequelize/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthentificationModule,
    GamesModule,
    AchievementsModule,
    UserAchievementsModule,
    LeaderboardsModule,
    MatchmakingModule,
    DuelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
