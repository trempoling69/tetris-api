import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';
import { CreateGameDto } from '../dto/create-game.dto';
import { User } from 'src/users/entities/user.entity';

@Exclude()
@Table
export class Game extends Model<Game, CreateGameDto> {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Expose()
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @Expose()
  score: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  lines_cleared: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @Expose()
  duration: number;

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
