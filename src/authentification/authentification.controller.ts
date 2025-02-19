import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { Throttle } from '@nestjs/throttler';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ResponseMessage } from 'src/decorator/response.message.decorator';
import { RequestAuthentificate } from 'src/appTypes/request';
import { RegisterUserDto } from './dto/register.dto';

@Controller('authentification')
export class AuthentificationController {
  constructor(
    private readonly authentificationService: AuthentificationService,
  ) {}

  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ResponseMessage('Connecté avec succès')
  async login(@Request() req: RequestAuthentificate) {
    return this.authentificationService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ResponseMessage('Fetch current user')
  async findOne(@Request() req: RequestAuthentificate) {
    return this.authentificationService.getCurrentUser(req.user);
  }

  @Throttle({ short: { limit: 2, ttl: 1000 }, long: { limit: 5, ttl: 60000 } })
  @Post('register')
  @ResponseMessage('Utilisateur créé avec succès')
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authentificationService.register(registerUserDto);
  }
}
