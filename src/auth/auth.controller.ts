import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { AccountService } from 'src/account/account.service';
import { UserDetails } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/password.dto';

@Controller('auth')
@ApiBearerAuth('JWT-auth')
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly accountService: AccountService,
              private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() register: RegisterDto): Promise<Record<string, any>> {
    const { email, password, first_name, middle_name, last_name, birthdate, username, city } = register;

    const candidateAcc = await this.accountService.account({
      email: email
    });

    if (candidateAcc) throw new HttpException('User with such email already exists', 400);

    const candidateUser = await this.userService.user({
      username: username
    });

    if (candidateUser) throw new HttpException('User with such username already exists', 400);

    const created = await this.authService.register({
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
      id: created.id,
    };
  }

  @Post('login')
  async login(@Body() login: LoginDto): Promise<Record<string, any>> {
    return this.authService.login(login);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(@Req() req, @Body() password: ChangePasswordDto) : Promise<Record<string, any>> {
    console.log(req.user);
    return this.authService.changePassword(req.user.sub, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() req) {
    return req.user;
  }
}
