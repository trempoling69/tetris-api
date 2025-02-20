import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/authentification/guard/jwt-auth.guard';
import { RequestAuthentificate } from 'src/appTypes/request';
import { ResponseMessage } from 'src/decorator/response.message.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/games')
  @ResponseMessage('Récupération des parties du joueur')
  findAll(@Req() req: RequestAuthentificate) {
    return this.usersService.findAllGames(req);
  }

  @Get('me/achievements')
  @ResponseMessage('Récupération des achievement du joueur')
  findAllAchievements(@Req() req: RequestAuthentificate) {
    return this.usersService.findAllAchievements(req);
  }
  @Get('me/achievements/progress')
  @ResponseMessage('Récupération de la progression des achievement du joueur')
  findAllAchievementsProgress(@Req() req: RequestAuthentificate) {
    return this.usersService.findAllAchievementsProgress(req);
  }
}
