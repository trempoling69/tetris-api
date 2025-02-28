import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsStrategy extends PassportStrategy(Strategy, 'ws') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: WsStrategy.extractJwt,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extractJwt(req: any): string | null {
    if (req?.headers?.authorization) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

  async validate(payload: { sub: string }) {
    const currentUser = await this.userService.findOne(payload.sub);
    if (!currentUser) {
      throw new WsException('Unauthorized');
    }
    return currentUser;
  }
}
