import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from './matchmaking.service';

@WebSocketGateway({ namespace: 'matchmaking' })
export class MatchmakingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly matchmakingService: MatchmakingService) {}

  afterInit(server: Server) {
    console.log('WebSocket Server Initialized');
  }

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
    return this.matchmakingService.quitQueue(socket, this.server);
  }

  @SubscribeMessage('joinQueue')
  join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { userId: string },
  ) {
    return this.matchmakingService.joinQueue(socket, data.userId, this.server);
  }

  @SubscribeMessage('scoreUpdate')
  scoreUpdate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { userId: string; score: number },
  ) {
    return this.matchmakingService.updateScore(
      data.userId,
      data.score,
      this.server,
    );
  }
}
