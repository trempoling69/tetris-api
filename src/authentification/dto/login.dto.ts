import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username manquant' })
  @IsString({ message: 'type invalide' })
  username: string;

  @IsNotEmpty({ message: 'Mot de passe manquant' })
  @IsString({ message: 'type invalide' })
  password: string;
}
