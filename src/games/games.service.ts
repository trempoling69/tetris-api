import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { Sequelize } from 'sequelize-typescript';
import { RequestAuthentificate } from 'src/appTypes/request';
import { AchievementsService } from 'src/achievements/achievements.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
    private readonly sequelize: Sequelize,
    private readonly achievementsService: AchievementsService,
  ) {}
  async create(createGameDto: CreateGameDto, req: RequestAuthentificate) {
    const game = await this.sequelize.transaction(async (transaction) => {
      const options = { transaction, userId: req.user.id };
      return this.gameModel.create(createGameDto, options);
    });

    await this.achievementsService.checkAchievements(req.user);

    return game;
  }

  findAllGameOfAPlayer(userId: string) {
    return this.gameModel.findAll({ where: { createdBy: userId } });
  }

  findOne(id: string) {
    return this.gameModel.findOne({ where: { id } });
  }
}
