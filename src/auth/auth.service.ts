import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDao } from './dao/login.dao';
import { TokenDto } from './dto/token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dao: LoginDao): Promise<TokenDto> {
    const { email, password } = dao;

    const candidate = await this.account({
      email: email,
    });

    if (candidate.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: candidate.id, email: candidate.email, role: candidate.role };
    
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: Prisma.AccountCreateInput): Promise<Account> {

    /*
  first_name  String
  middle_name String
  last_name   String

  city String

  birthdate DateTime
    */

    return this.prisma.account.create({
      data: data
    });
  }

  async account(
    where: Prisma.AccountWhereUniqueInput,
    include?: Prisma.AccountInclude,
  ) {
    return this.prisma.account.findUnique({
      where: where,
      include: include,
    });
  }
}
