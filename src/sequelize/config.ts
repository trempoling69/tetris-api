import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { Game } from 'src/games/entities/game.entity';
import { User } from 'src/users/entities/user.entity';

export default (configService: ConfigService): SequelizeModuleOptions => {
  return {
    dialect:
      (configService.get('DB_DIALECT') as Dialect | undefined) || 'mysql',
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT')!, 10) || 3306,
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    models: [User, Game],
    autoLoadModels: true,
    synchronize: false,
  };
};
