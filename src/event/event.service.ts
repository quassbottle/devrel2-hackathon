import { Injectable } from '@nestjs/common';
import { EventCreateDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma, Event } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor (private readonly prisma: PrismaService) {}
  
  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({
      data: data,
    });
  }

  async event(where: Prisma.EventWhereUniqueInput, include?: Prisma.EventInclude) {
    return this.prisma.event.findUnique({
      where: where,
      include: include
    });
  }

  async events(params: {
    skip? : number,
    take? : number,
    cursor? : Prisma.EventWhereUniqueInput,
    where? : Prisma.EventWhereInput,
    orderBy? : Prisma.EventOrderByWithRelationInput,
    include? : Prisma.EventInclude
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.event.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include
    })
  }

  async update(params: {
    where: Prisma.EventWhereUniqueInput,
    data: Prisma.EventUpdateInput,
    include?: Prisma.EventInclude
  }) {
    const { data, where, include } = params;
    return this.prisma.event.update({
      data: data,
      where: where,
      include: include
    });
  }

  async delete(where: Prisma.EventWhereUniqueInput) 
    : Promise<Event> {
    return this.prisma.event.delete({
      where: where
    });
  }
}
