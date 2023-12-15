import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { document } from './main';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('swagger/docs')
	async swag() {
		return JSON.stringify(document);
	}
}
