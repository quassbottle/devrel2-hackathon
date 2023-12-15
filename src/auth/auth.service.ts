import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDao } from './dao/login.dao';
import { TokenDto } from './dto/token.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDao } from './dao/password.dao';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  salt = 10;

  async changePassword(id: number, dao: ChangePasswordDao) {
    const { password } = dao;
    
    const hash = await bcrypt.hash(password, this.salt);

    const res = await this.prisma.account.update({
      where: {
        id
      },
      data: {
        password: hash
      }
    });
    
    return {
      id: res.id
    }
  }

  async login(dao: LoginDao): Promise<TokenDto> {
    const { email, password } = dao;

    const hash = await bcrypt.hash(password, this.salt);

    const candidate = await this.account({
      email: email,
    });

    if (!(await bcrypt.compare(password, hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: candidate.id, email: candidate.email, role: candidate.role };
    
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: Prisma.AccountCreateInput): Promise<Account> {
    const hash = await bcrypt.hash(data.password, this.salt);

    data.password = hash;

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
