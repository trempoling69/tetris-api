import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAchievementDto {
  @IsNotEmpty({ message: 'Nom manquant' })
  @IsString({ message: 'Type invalide' })
  name: string;

  @IsNotEmpty({ message: 'Description manquante' })
  @IsString({ message: 'Type invalide' })
  description: string;

  @IsNotEmpty({ message: 'Condition manquante' })
  @IsString({ message: 'type invalide' })
  conditionType: string;

  @IsNotEmpty({ message: 'Quantité manquante' })
  @IsNumber({ allowNaN: false }, { message: 'type invalide - int attendu' })
  conditionValue: number;

  @IsOptional()
  @IsString({ message: 'Type invalide' })
  icon_url: string | null;
}
