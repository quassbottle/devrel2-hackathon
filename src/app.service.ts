import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const test = new PrismaClient();

@Injectable()
export class AppService {
	getHello(): Promise<any> {
		return test.user.findMany();
	}
}
