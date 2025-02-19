import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { Sequelize } from 'sequelize-typescript';
import { RequestAuthentificate } from 'src/appTypes/request';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
    private readonly sequelize: Sequelize,
  ) {}
  create(createGameDto: CreateGameDto, req: RequestAuthentificate) {
    return this.sequelize.transaction(async (transaction) => {
      const options = { transaction, userId: req.user.id };
      return this.gameModel.create(createGameDto, options);
    });
  }

  findAllGameOfAPlayer(userId: string) {
    return this.gameModel.findAll({ where: { createdBy: userId } });
  }

  findOne(id: string, userId: string) {
    return this.gameModel.findOne({ where: { id, createdBy: userId } });
  }
}
