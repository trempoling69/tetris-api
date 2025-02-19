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

  @Get()
  @ResponseMessage('Récupération des parties du joueur')
  findAll(@Request() req: RequestAuthentificate) {
    return this.gamesService.findAllGameOfAPlayer(req.user.id);
  }

  @Get(':id')
  @ResponseMessage("Récupération d'une partie du joueur")
  findOne(@Param('id') id: string, @Request() req: RequestAuthentificate) {
    return this.gamesService.findOne(id, req.user.id);
  }
}
