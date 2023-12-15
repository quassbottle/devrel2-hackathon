import { Injectable } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor (private readonly prisma: PrismaService) {}

  
  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    return this.prisma.account.create({
      data: data,
    });
  }

  async account(where: Prisma.AccountWhereUniqueInput, include?: Prisma.AccountInclude) {
    return this.prisma.account.findUnique({
      where: where,
      include: include
    });
  }

  async accounts(params: {
    skip? : number,
    take? : number,
    cursor? : Prisma.AccountWhereUniqueInput,
    where? : Prisma.AccountWhereInput,
    orderBy? : Prisma.AccountOrderByWithRelationInput,
    include? : Prisma.AccountInclude
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.account.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include
    })
  }

  async update(params: {
    where: Prisma.AccountWhereUniqueInput,
    data: Prisma.AccountUpdateInput,
    include?: Prisma.AccountInclude
  }) {
    const { data, where, include } = params;
    return this.prisma.account.update({
      data: data,
      where: where,
      include: include
    });
  }

  async delete(where: Prisma.AccountWhereUniqueInput) 
    : Promise<Account> {
    return this.prisma.account.delete({
      where: where
    });
  }
}
