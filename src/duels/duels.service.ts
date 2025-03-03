import { Injectable } from '@nestjs/common';
import { CreateDuelDto } from './dto/create-duel.dto';
import { UpdateDuelDto } from './dto/update-duel.dto';
import { Duel } from './entities/duel.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DuelsService {
  constructor(
    @InjectModel(Duel)
    private duelModel: typeof Duel,
  ) {}

  create(createDuelDto: CreateDuelDto) {
    return this.duelModel.create(createDuelDto);
  }

  findAll() {
    return `This action returns all duels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} duel`;
  }

  update(id: number, updateDuelDto: UpdateDuelDto) {
    return `This action updates a #${id} duel`;
  }

  remove(id: number) {
    return `This action removes a #${id} duel`;
  }
}
