import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { ResponseMessage } from 'src/decorator/response.message.decorator';
import { RequestAuthentificate } from 'src/appTypes/request';
import { JwtAuthGuard } from 'src/authentification/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ResponseMessage('Partie enregistrée avec succès')
  create(
    @Body() createGameDto: CreateGameDto,
    @Request() req: RequestAuthentificate,
  ) {
    return this.gamesService.create(createGameDto, req);
  }

  @Get(':id')
  @ResponseMessage("Récupération d'une partie")
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }
}
