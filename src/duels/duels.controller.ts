import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DuelsService } from './duels.service';
import { CreateDuelDto } from './dto/create-duel.dto';
@Controller('duels')
export class DuelsController {
  constructor(private readonly duelsService: DuelsService) {}

  @Post()
  create(@Body() createDuelDto: CreateDuelDto) {
    return this.duelsService.create(createDuelDto);
  }

  @Get()
  findAll() {
    return this.duelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.duelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.duelsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.duelsService.remove(+id);
  }
}
