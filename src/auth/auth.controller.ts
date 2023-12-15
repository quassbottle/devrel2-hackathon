import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDao } from './dao/login.dao';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() register: AuthDao): Promise<Record<string, any>> {
    const { email, password } = register;

    const candidate = await this.authService.register({
      email: email,
      password: password,
      role: 'default'
    });

    return {
      id: candidate.id,
    };
  }

  @Post('login')
  async login(@Body() login: AuthDao): Promise<Record<string, any>> {
    return this.authService.login(login);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() req) {
    return req.user;
  }
}
