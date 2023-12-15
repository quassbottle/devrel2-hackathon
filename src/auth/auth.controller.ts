import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDao } from './dao/login.dao';
import { AuthGuard } from './auth.guard';
import { RegisterDao } from './dao/register.dao';
import { UserService } from 'src/user/user.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() register: RegisterDao): Promise<Record<string, any>> {
    const { email, password, first_name, middle_name, last_name, birthdate, username, city } = register;

    const candidate = await this.authService.register({
      email,
      password,
      role: 'default',
      user: {
        create: {
          first_name,
          middle_name,
          last_name,
          birthdate,
          username,
          city
        }
      }
    });

    return {
      id: candidate.id,
    };
  }

  @Post('login')
  async login(@Body() login: LoginDao): Promise<Record<string, any>> {
    return this.authService.login(login);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() req) {
    return req.user;
  }
}
