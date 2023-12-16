import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, UserDetails } from '@prisma/client';

console.log();

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserDetailsCreateInput): Promise<UserDetails> {
    return this.prisma.userDetails.create({
      data: data,
    });
  }

  async user(where: Prisma.UserDetailsWhereUniqueInput, include?: Prisma.UserDetailsInclude) : Promise<any> {
    return this.prisma.userDetails.findUnique({
      where: where,
      include: include
    });
  }

  async users(params: {
    skip? : number,
    take? : number,
    cursor? : Prisma.UserDetailsWhereUniqueInput,
    where? : Prisma.UserDetailsWhereInput,
    orderBy? : Prisma.UserDetailsOrderByWithRelationInput,
    include? : Prisma.UserDetailsInclude
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.userDetails.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include
    })
  }

  async update(params: {
    where: Prisma.UserDetailsWhereUniqueInput,
    data: Prisma.UserDetailsUpdateInput,
    include?: Prisma.UserDetailsInclude
  }) {
    const { data, where, include } = params;
    return this.prisma.userDetails.update({
      data: data,
      where: where,
      include: include
    });
  }

  async delete(where: Prisma.UserDetailsWhereUniqueInput) 
    : Promise<UserDetails> {
    return this.prisma.userDetails.delete({
      where: where
    });
  }
}
