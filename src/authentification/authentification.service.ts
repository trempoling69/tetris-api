import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register.dto';

@Injectable()
export class AuthentificationService {
  constructor(
    private userService: UsersService,
    private readonly cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}
  async validateUser(loginData: LoginDto): Promise<User> {
    try {
      const user = await this.userService.findOneByUsername(loginData.username);
      if (!user) {
        throw new HttpException(
          'Identifiant ou mot de passe incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.verifyPassword(loginData.password, user.password);
      return user;
    } catch (error) {
      throw error;
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await this.cryptoService.compareHash(
      password,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Identifiant ou mot de passe incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(user: User) {
    await this.userService.updateLastConnection(user.id);
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getCurrentUser(user: User): Promise<User | null> {
    const currentUser = this.userService.findOne(user.id);
    if (!currentUser) {
      throw new HttpException('Utilisateur inexistant', HttpStatus.BAD_REQUEST);
    }
    return currentUser;
  }

  async register(registerData: RegisterUserDto) {
    const user = await this.userService.findOneByUsername(
      registerData.username,
    );
    if (user) {
      throw new HttpException('Le user existe déjà', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await this.cryptoService.generateHash(
      registerData.password,
    );
    try {
      const createdUser = await this.userService.create({
        ...registerData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (_err) {
      throw new HttpException(
        'Une erreur est survenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
