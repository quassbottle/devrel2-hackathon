import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req, HttpException, HttpStatus } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CompanyDetails, UserDetails } from '@prisma/client';
import { CompanyCreateDto } from './dto/create-company.dto';
import { AccountService } from 'src/account/account.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { CompanyChangeStatusDto } from './dto/change-status.dto';

@ApiTags('company')
@ApiBearerAuth('JWT-auth')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService,
              private readonly accountService: AccountService) {}

  @Get('own')
  @UseGuards(AuthGuard)
  async getOwn(@Req() req) : Promise<CompanyDetails> {
    const res = await this.companyService.company({
      account_id: req.user.sub
    });

    if (res == null) {
      throw new HttpException('Company not found', 404)
    }

    return res;
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id) : Promise<CompanyDetails> {
    const res = await this.companyService.company({ id: id });
    
    if (res == null) {
      throw new HttpException('Company not found', 404)
    }

    return res;
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id, @Req() req) : Promise<CompanyDetails> {
    const company = await this.companyService.company({ id: id });

    if (company == null) {
      throw new HttpException('Company not found', 404);
    }

    if (company.account_id !== req.user.sub && req.user.role != 'admin') {
      throw new HttpException('This group is not yours', HttpStatus.FORBIDDEN);
    }

    return this.companyService.delete({ id: id });
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Post('status/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.Moderator)
  async changeStatus(@Param('id', ParseIntPipe) id, @Req() req, @Body() statusDto: CompanyChangeStatusDto) : Promise<CompanyDetails> {
    const company = await this.companyService.company({ id });

    if (company == null) {
      throw new HttpException('Company not found', 404);
    }

    return this.companyService.update({
      where: {
        id: id
      },
      data: {
        status: statusDto.status
      }
    })
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get(':id/employees')
  async getEmployees(@Param('id', ParseIntPipe) id) : Promise<UserDetails[]> {
    const company = await this.companyService.company({ id }, { employees: true });

    if (company == null) {
      throw new HttpException('Company not found', 404);
    }

    const owner = await this.accountService.account({ id: company.account_id }, { user: true });

    return company.employees;
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() create: CompanyCreateDto, @Req() req) : Promise<any> {
    const { title, description, city } = create;
    const id = req.user.sub;

    const candidate = await this.companyService.company({
      account_id: id
    });

    if (candidate) throw new HttpException('You already own a company', 400);

    const companyCreate = await this.accountService.update({
      where: {
        id
      },
      data: {
        company: {
          create: {
            title, description, city
          }
        }
      },
      include: {
        company: true
      }
    });

    const res = await this.accountService.update({
      where: {
        id
      },
      data: {
        user: {
          update: {
            company_id: companyCreate.company.id
          }
        }
      },
      include: {
        company: true
      }
    });


    return res.company;
  }
}
