import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { CreateDuelDto } from '../dto/create-duel.dto';

@Exclude()
@Table
export class Duel extends Model<Duel, CreateDuelDto> {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Expose()
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  player1Id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  player2Id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  winnerId: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Expose()
  createdAt: string;

  @BelongsTo(() => User, { foreignKey: 'player1Id', as: 'player1' })
  @Expose()
  player1: User;

  @BelongsTo(() => User, { foreignKey: 'player2Id', as: 'player2' })
  @Expose()
  player2: User;

  @BelongsTo(() => User, { foreignKey: 'winnerId', as: 'winner' })
  @Expose()
  winner: User;
}
