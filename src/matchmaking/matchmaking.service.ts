import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

interface Player {
  socket: Socket;
  userId: string;
  roomId?: string;
  score?: number;
}

interface GameRoom {
  roomId: string;
  players: Player[];
  seed: number;
  timeout?: NodeJS.Timeout;
}

@Injectable()
export class MatchmakingService {
  private queue: Player[] = [];
  private activeGames: Map<string, GameRoom> = new Map();

  joinQueue(socket: Socket, userId: string, server: Server) {
    if (this.checkIfPlayerIsInGame(userId, socket, server)) {
      return;
    }
    this.addPlayerInQueue(userId, socket, server);
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

  checkIfPlayerIsInGame(userId: string, socket: Socket, server: Server) {
    for (const game of this.activeGames.values()) {
      const player = game.players.find((p) => p.userId === userId);
      if (player) {
        player.socket = socket;
        socket.join(game.roomId);

        if (game.timeout) {
          clearTimeout(game.timeout);
          game.timeout = undefined;
        }

        server.to(game.roomId).emit('playerReconnected', { userId });

        return true;
      }
    }
  }

  addPlayerInQueue(userId: string, socket: Socket, server: Server) {
    this.queue.push({ socket, userId });

    if (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();

      if (player1 && player2) {
        const roomId = `room-${player1.userId}-${player2.userId}`;
        const seed = Math.floor(Math.random() * 100000);

        player1.socket.join(roomId);
        player2.socket.join(roomId);

        const game: GameRoom = {
          roomId,
          players: [
            { ...player1, score: 0 },
            { ...player2, score: 0 },
          ],
          seed,
        };

        this.activeGames.set(roomId, game);

        server.to(roomId).emit('matchFound', { roomId, seed });
      }
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
}
