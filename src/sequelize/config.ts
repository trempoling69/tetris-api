import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { Game } from 'src/games/entities/game.entity';
import { UserAchievement } from 'src/user-achievements/entities/user-achievements.entity';
import { User } from 'src/users/entities/user.entity';

export default (configService: ConfigService): SequelizeModuleOptions => {
  return {
    dialect:
      (configService.get('DB_DIALECT') as Dialect | undefined) || 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT')!, 10) || 3306,
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    models: [User, Game, Achievement, UserAchievement],
    autoLoadModels: true,
    synchronize: false,
  };
};
