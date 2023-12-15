import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyDetails, CompanyInvite, Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor (private readonly prisma: PrismaService) {}

  async createInvite(data: Prisma.CompanyInviteCreateInput): Promise<CompanyInvite> {
    return this.prisma.companyInvite.create({
      data: data
    });
  }

  async deleteInvite(where: Prisma.CompanyInviteWhereUniqueInput): Promise<CompanyInvite> {
    return this.prisma.companyInvite.delete({
      where
    });
  }

  async invite(where: Prisma.CompanyInviteWhereUniqueInput, include?: Prisma.CompanyInviteInclude) {
    return this.prisma.companyInvite.findUnique({
      where: where,
      include: include
    });
  }

  async createCompany(data: Prisma.CompanyDetailsCreateInput): Promise<CompanyDetails> {
    return this.prisma.companyDetails.create({
      data: data,
    });
  }

  async company(where: Prisma.CompanyDetailsWhereUniqueInput, include?: Prisma.CompanyDetailsInclude) {
    return this.prisma.companyDetails.findUnique({
      where: where,
      include: include
    });
  }

  async companies(params: {
    skip? : number,
    take? : number,
    cursor? : Prisma.CompanyDetailsWhereUniqueInput,
    where? : Prisma.CompanyDetailsWhereInput,
    orderBy? : Prisma.CompanyDetailsOrderByWithRelationInput,
    include? : Prisma.CompanyDetailsInclude
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.companyDetails.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include
    })
  }

  async updateCompany(params: {
    where: Prisma.CompanyDetailsWhereUniqueInput,
    data: Prisma.CompanyDetailsUpdateInput,
    include?: Prisma.CompanyDetailsInclude
  }) {
    const { data, where, include } = params;
    return this.prisma.companyDetails.update({
      data: data,
      where: where,
      include: include
    });
  }

  async delete(where: Prisma.CompanyDetailsWhereUniqueInput) 
    : Promise<CompanyDetails> {
    return this.prisma.companyDetails.delete({
      where: where
    });
  }
}
