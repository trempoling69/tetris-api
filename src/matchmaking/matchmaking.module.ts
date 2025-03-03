import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingGateway } from './matchmaking.gateway';
import { DuelsModule } from 'src/duels/duels.module';

@Module({
  imports: [DuelsModule],
  providers: [MatchmakingGateway, MatchmakingService],
})
export class MatchmakingModule {}
