import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CreateUserDto } from '../dto/create-user.dto';
import { Exclude, Expose } from 'class-transformer';
import { Achievement } from 'src/achievements/entities/achievement.entity';
import { UserAchievement } from 'src/user-achievements/entities/user-achievements.entity';
import {
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import { Game } from 'src/games/entities/game.entity';

@Exclude()
@Table
export class User extends Model<User, CreateUserDto> {
  declare addAchievements: BelongsToManyAddAssociationsMixin<
    Achievement,
    string
  >;
  declare getAchievements: BelongsToManyGetAssociationsMixin<Achievement>;

  declare getGames: HasManyGetAssociationsMixin<Game>;

  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Expose()
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @Expose()
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Expose()
  last_connection: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Expose()
  createdAt: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Expose()
  createdBy: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Expose()
  updatedBy: string;

  @HasMany(() => Game, { foreignKey: 'createdBy' })
  @Expose()
  games: Game[];

  @BelongsToMany(() => Achievement, () => UserAchievement)
  @Expose()
  achievements: Achievement[];

  @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'creator' })
  @Expose()
  creator: User;

  @BelongsTo(() => User, { foreignKey: 'updatedBy', as: 'updater' })
  @Expose()
  updater: User;

  @HasMany(() => User, { foreignKey: 'createdBy' })
  @Expose()
  createdUsers: User[];

  @HasMany(() => User, { foreignKey: 'updatedBy' })
  @Expose()
  updatedUsers: User[];

  @BeforeCreate
  static setCreatedBy(instance: User, options: { userId: string }) {
    if (options.userId) {
      instance.createdBy = options.userId;
    }
  }

  @BeforeUpdate
  static setUpdatedBy(instance: User, options: { userId: string }) {
    if (options.userId) {
      instance.updatedBy = options.userId;
    }
  }
}
