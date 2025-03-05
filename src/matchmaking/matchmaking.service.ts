import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { DuelsService } from 'src/duels/duels.service';

interface Player {
  socket: Socket;
  userId: string;
  roomId?: string;
  score?: number;
}

interface GameRoom {
  roomId: string;
  players: Player[];
  duelId: string;
  seed: number;
  timeout?: NodeJS.Timeout;
}

@Injectable()
export class MatchmakingService {
  private queue: Player[] = [];
  private activeGames: Map<string, GameRoom> = new Map();

  private server: Server | null = null;

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly duelsService: DuelsService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  joinQueue(socket: Socket, userId: string) {
    if (this.checkIfPlayerIsInGame(userId, socket)) {
      return;
    }
    this.addPlayerInQueue(userId, socket);
  }

  quitQueue(socket: Socket, server: Server) {
    for (const game of this.activeGames.values()) {
      const player = game.players.find((p) => p.socket.id === socket.id);
      if (player) {
        console.log(
          `player ${player.userId} disconnect from room ${game.roomId}`,
        );

        game.timeout = setTimeout(() => {
          console.log(
            `player ${player.userId} not reconnect in time removing from game ${game.roomId}`,
          );
          game.players = game.players.filter((p) => p.socket.id !== socket.id);

          if (game.players.length === 0) {
            this.activeGames.delete(game.roomId);
          } else {
            server
              .to(game.roomId)
              .emit('playerLeft', { userId: player.userId });
          }
        }, 10000);
        return;
      }
    }

    this.queue = this.queue.filter((player) => player.socket.id !== socket.id);
  }

  checkIfPlayerIsInGame(userId: string, socket: Socket) {
    for (const game of this.activeGames.values()) {
      const player = game.players.find((p) => p.userId === userId);
      if (player) {
        player.socket = socket;
        socket.join(game.roomId);

        if (game.timeout) {
          clearTimeout(game.timeout);
          game.timeout = undefined;
        }

        this.server.to(game.roomId).emit('playerReconnected', {
          userId,
          seed: game.seed,
          duelId: game.duelId,
        });

        return true;
      }
    }
  }

  addPlayerInQueue(userId: string, socket: Socket) {
    this.queue.push({ socket, userId });

    if (this.queue.length >= 2) {
      this.eventEmitter.emit('matchmaking.check');
    }
  }

  updateScore(userId: string, score: number, server: Server) {
    for (const game of this.activeGames.values()) {
      const player = game.players.find((p) => p.userId === userId);
      if (player) {
        player.score = score;
        server.to(game.roomId).emit(
          'liveScoreUpdate',
          game.players.map(({ userId, score }) => ({
            userId,
            score,
          })),
        );
        return;
      }
    }
  }

  @OnEvent('matchmaking.check')
  private matchPlayers() {
    while (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();

      if (player1 && player2) {
        this.initGame(player1, player2);
      }
    }
  }

  private async initGame(player1: Player, player2: Player) {
    const roomId = `room-${player1.userId}-${player2.userId}`;
    const seed = Math.floor(Math.random() * 100000);

    player1.socket.join(roomId);
    player2.socket.join(roomId);

    const duel = await this.duelsService.create({
      player1Id: player1.userId,
      player2Id: player2.userId,
    });

    const game: GameRoom = {
      roomId,
      duelId: duel.id,
      players: [
        { ...player1, score: 0 },
        { ...player2, score: 0 },
      ],
      seed,
    };

    this.activeGames.set(roomId, game);

    this.server
      .to(roomId)
      .emit('matchFound', { roomId, seed, duelId: duel.id });
  }
}
