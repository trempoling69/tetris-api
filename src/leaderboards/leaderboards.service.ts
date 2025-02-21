import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from 'src/games/entities/game.entity';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { endOfDay, endOfWeek, startOfDay, startOfWeek } from 'date-fns';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LeaderboardsService {
  constructor(@InjectModel(Game) private gameModel: typeof Game) {}

  buildWhereClause(period: string): WhereOptions<Game> {
    switch (period) {
      case 'daily':
        return {
          createdAt: {
            [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
          },
        };
      case 'weekly':
        return {
          createdAt: {
            [Op.between]: [startOfWeek(new Date()), endOfWeek(new Date())],
          },
        };
      default:
        return {};
    }
  }

  async getByBestScores(limit: number = 10, period: string) {
    return this.gameModel.findAll({
      attributes: [
        'createdBy',
        [
          this.gameModel.sequelize.fn(
            'MAX',
            this.gameModel.sequelize.col('score'),
          ),
          'best_score',
        ],
      ],
      where: this.buildWhereClause(period),
      include: [{ model: User, as: 'player', attributes: ['username'] }],
      group: ['createdBy'],
      order: [[this.gameModel.sequelize.literal('best_score'), 'DESC']],
      limit,
    });
  }

  async getByTotalScores(limit: number = 10, period: string) {
    return this.gameModel.findAll({
      attributes: [
        'createdBy',
        [
          this.gameModel.sequelize.fn(
            'SUM',
            this.gameModel.sequelize.col('score'),
          ),
          'total_score',
        ],
      ],
      where: this.buildWhereClause(period),
      include: [{ model: User, as: 'player', attributes: ['username'] }],
      group: ['createdBy'],
      order: [[this.gameModel.sequelize.literal('total_score'), 'DESC']],
      limit,
    });
  }
}
