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
import { Exclude, Expose } from 'class-transformer';
import { CreateGameDto } from '../dto/create-game.dto';
import { User } from 'src/users/entities/user.entity';
import { Duel } from 'src/duels/entities/duel.entity';

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
  @Expose()
  lines_cleared: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @Expose()
  duration: number;

  @Column({
    type: DataType.VIRTUAL,
  })
  @Expose()
  best_score: number;

  @Column({
    type: DataType.VIRTUAL,
  })
  @Expose()
  total_score: number;

  @Column({
    type: DataType.VIRTUAL,
  })
  @Expose()
  play_time: number;

  @Column({
    type: DataType.VIRTUAL,
  })
  @Expose()
  total_games: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Expose()
  createdAt: string;

  @ForeignKey(() => Duel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  duelId: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  createdBy: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  updatedBy: string;

  @BelongsTo(() => Duel, { foreignKey: 'duelId', as: 'duel' })
  @Expose()
  duel: Duel;

  @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'player' })
  @Expose()
  player: User;

  @BelongsTo(() => User, { foreignKey: 'updatedBy', as: 'updater' })
  @Expose()
  updater: User;

  @BeforeCreate
  static setCreatedBy(instance: Game, options: { userId: string }) {
    if (options.userId) {
      instance.createdBy = options.userId;
    }
  }

  @BeforeUpdate
  static setUpdatedBy(instance: Game, options: { userId: string }) {
    if (options.userId) {
      instance.updatedBy = options.userId;
    }
  }
}
