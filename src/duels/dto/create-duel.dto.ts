import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDuelDto {
  @IsNotEmpty({ message: 'joueur 1 manquant' })
  @IsString({ message: 'type invalide' })
  player1Id: string;

  @IsNotEmpty({ message: 'joueur 2 manquant' })
  @IsString({ message: 'type invalide' })
  player2Id: string;

  @IsOptional()
  @IsString({ message: 'type invalide' })
  winnerId?: string | null;
}
