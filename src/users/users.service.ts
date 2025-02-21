import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Op } from 'sequelize';
import { RequestAuthentificate } from 'src/appTypes/request';
import { Sequelize } from 'sequelize-typescript';
import { AchievementsService } from 'src/achievements/achievements.service';
import { GamesService } from 'src/games/games.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly sequelize: Sequelize,
    private readonly achievementsService: AchievementsService,
    private readonly gamesService: GamesService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.sequelize.transaction(async (transaction) => {
      const options = { transaction, userId: null };
      return this.userModel.create(createUserDto, options);
    });
  }

  findAll() {
    return this.userModel.findAll();
  }

  findOne(id: string) {
    return this.userModel.findByPk(id);
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      where: { username: { [Op.eq]: username } },
    });
  }

  updateLastConnection(id: string) {
    const last_connection = new Date();
    return this.userModel.update({ last_connection }, { where: { id } });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    req: RequestAuthentificate,
  ) {
    const userToUpdate = await this.userModel.findByPk(id);
    if (!userToUpdate) {
      throw new HttpException(
        'Une erreur est survenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // const isUsernameAlreadyUse = await this.userModel.findOne({
    //   where: {
    //     username: { [Op.eq]: updateUserDto.username },
    //     id: { [Op.not]: id },
    //   },
    // });

    // if (isUsernameAlreadyUse) {
    //   throw new HttpException(
    //     "Nom d'utilisateur déjà utilisé",
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }

    return this.sequelize.transaction(async (transaction) => {
      const options = { transaction, userId: req.user.id };
      return userToUpdate.update(updateUserDto, options);
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findAllGames(req: RequestAuthentificate) {
    return req.user.getGames();
  }

  findAllAchievements(req: RequestAuthentificate) {
    return req.user.getAchievements();
  }

  findAllAchievementsProgress(req: RequestAuthentificate) {
    return this.achievementsService.getUserAchievementsProgress(req.user);
  }

  async getPlayerProfil(req: RequestAuthentificate) {
    const gameStats = await this.gamesService.getGamesStatOfAPlayer(
      req.user.id,
    );

    const totalAchievement = await this.achievementsService.count();

    const userAchievement = await req.user.getAchievements();

    return {
      totalGames: gameStats.total_games,
      timePlayed: gameStats.play_time,
      bestScore: gameStats.best_score,
      totalScore: gameStats.total_score,
      achievementComplete: userAchievement.length,
      totalAchievement,
    };
  }
}
