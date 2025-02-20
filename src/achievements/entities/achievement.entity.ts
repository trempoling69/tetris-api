import {
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { Exclude, Expose } from 'class-transformer';
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserAchievement } from 'src/user-achievements/entities/user-achievements.entity';
import { User } from 'src/users/entities/user.entity';

@Exclude()
@Table
export class Achievement extends Model<Achievement, CreateAchievementDto> {
  declare addUsers: BelongsToManyAddAssociationsMixin<User, string>;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;

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
  })
  @Expose()
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Expose()
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Expose()
  conditionType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @Expose()
  conditionValue: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @Expose()
  icon_url: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Expose()
  createdAt: string;

  @BelongsToMany(() => User, () => UserAchievement)
  @Expose()
  users: User[];

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
  static setCreatedBy(instance: Achievement, options: { userId: string }) {
    if (options.userId) {
      instance.createdBy = options.userId;
    }
  }

  @BeforeUpdate
  static setUpdatedBy(instance: Achievement, options: { userId: string }) {
    if (options.userId) {
      instance.updatedBy = options.userId;
    }
  }
}
