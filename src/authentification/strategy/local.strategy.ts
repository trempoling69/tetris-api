import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthentificationService } from '../authentification.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authentificationService: AuthentificationService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authentificationService.validateUser({
      username: username,
      password: password,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
