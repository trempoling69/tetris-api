import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class JwtWsGuard extends AuthGuard('ws') {
  getRequest(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();

    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) {
        client.disconnect();
        throw new WsException('Unauthorized');
      }
      return {
        headers: { ...client.handshake.headers, authorization: authHeader },
      };
    } catch (error) {
      console.error('WebSocket Auth Error:', error.message);
      client.disconnect();
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();

    if (err || !user) {
      console.error('WebSocket Auth Error:', err?.message || 'Unauthorized');
      client.disconnect();
      throw new WsException('Unauthorized');
    }

    return user;
  }
}
