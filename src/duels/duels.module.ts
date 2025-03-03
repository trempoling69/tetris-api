import { Module } from '@nestjs/common';
import { DuelsService } from './duels.service';
import { DuelsController } from './duels.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Duel } from './entities/duel.entity';

@Module({
  imports: [SequelizeModule.forFeature([Duel])],
  controllers: [DuelsController],
  providers: [DuelsService],
  exports: [DuelsService],
})
export class DuelsModule {}
