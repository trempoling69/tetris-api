import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateGameDto {
  @IsNotEmpty({ message: 'score manquant' })
  @IsNumber({ allowNaN: false }, { message: 'type invalide - int attendu' })
  score: number;

  @IsNotEmpty({ message: 'ligne supprimée manquant' })
  @IsNumber({ allowNaN: false }, { message: 'type invalide - int attendu' })
  lines_cleared: number;

  @IsNotEmpty({ message: 'durée manquante' })
  @IsNumber({ allowNaN: false }, { message: 'type invalide - int attendu' })
  duration: number;
}
