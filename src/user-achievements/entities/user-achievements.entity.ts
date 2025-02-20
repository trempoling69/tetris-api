import { Exclude, Expose } from 'class-transformer';
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { CreateUserAchievementDto } from '../dto/create-user-achievements.dto';
import { Achievement } from 'src/achievements/entities/achievement.entity';

@Exclude()
@Table({ tableName: 'UserAchievement' })
export class UserAchievement extends Model<
  UserAchievement,
  CreateUserAchievementDto
> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  @Expose()
  user_id: string;

  @PrimaryKey
  @ForeignKey(() => Achievement)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  @Expose()
  achievement_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Expose()
  createdBy: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Expose()
  updatedBy: string | null;

  @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'creator' })
  @Expose()
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updatedBy', as: 'updater' })
  @Expose()
  updater: User;

  @BeforeCreate
  static setCreatedBy(instance: UserAchievement, options: { userId: string }) {
    if (options.userId) {
      instance.createdBy = options.userId;
    }
  }

  @BeforeUpdate
  static setUpdatedBy(instance: UserAchievement, options: { userId: string }) {
    if (options.userId) {
      instance.updatedBy = options.userId;
    }
  }
}
