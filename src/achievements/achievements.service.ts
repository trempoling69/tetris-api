import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { Game } from 'src/games/entities/game.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement)
    private achievementModel: typeof Achievement,
  ) {}

  findAll() {
    return this.achievementModel.findAll();
  }

  count() {
    return this.achievementModel.count();
  }

  create(createAchievementDto: CreateAchievementDto) {
    return this.achievementModel.create(createAchievementDto);
  }

  async checkAchievements(user: User) {
    const achievements = await this.achievementModel.findAll();
    const unlockedAchievements = await user.getAchievements();

    for (const achievement of achievements) {
      if (unlockedAchievements.some((a) => a.id === achievement.id)) continue;

      const isUnlocked = await this.isAchievementUnlocked(user, achievement);
      if (isUnlocked) {
        await user.addAchievements([achievement]);
      }
    }
  }

  async isAchievementUnlocked(user: User, achievement: Achievement) {
    const playerGames = await user.getGames();
    switch (achievement.conditionType) {
      case 'lines_cleared_total':
        const totalLines = playerGames.reduce(
          (sum, game) => sum + game.lines_cleared,
          0,
        );
        return totalLines >= achievement.conditionValue;

      case 'max_score':
        const maxScore = Math.max(...playerGames.map((game) => game.score));
        return maxScore >= achievement.conditionValue;

      case 'time_played':
        const timePlayed = playerGames.reduce(
          (sum, game) => sum + game.duration,
          0,
        );
        return timePlayed >= achievement.conditionValue;

      case 'game_played':
        const amountOfGame = playerGames.length;
        return amountOfGame >= achievement.conditionValue;

      default:
        return false;
    }
  }

  async getUserAchievementsProgress(user: User) {
    const achievements = await this.achievementModel.findAll();
    const unlockedAchievements = await user.getAchievements();

    const allGamesPlayed = await user.getGames();

    return achievements.map((achievement) => {
      const isUnlocked = unlockedAchievements.some(
        (a) => a.id === achievement.id,
      );
      const progress = this.getAchievementProgress(achievement, allGamesPlayed);

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        required: achievement.conditionValue,
        progress,
        percentage: Math.min(
          (progress / achievement.conditionValue) * 100,
          100,
        ),
        unlocked: isUnlocked,
      };
    });
  }

  private getAchievementProgress(achievement: Achievement, allGames: Game[]) {
    switch (achievement.conditionType) {
      case 'lines_cleared_total':
        return allGames.reduce((sum, game) => sum + game.lines_cleared, 0);

      case 'max_score':
        return Math.max(...allGames.map((game) => game.score), 0);

      case 'time_played':
        return allGames.reduce((sum, game) => sum + game.duration, 0);

      case 'game_played':
        return allGames.length;

      default:
        return 0;
    }
  }
}
