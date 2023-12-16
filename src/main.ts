import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { join } from 'node:path'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders:
      'X-Requested-With, Origin, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization'
    //allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
  })

	const config = new DocumentBuilder()
		.setTitle('API')
		.setDescription('w')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	const filePath = join(__dirname,'swagger');
  if (!fs.existsSync(filePath)){
      fs.mkdirSync(filePath, {recursive: true})
			//fs.writeFileSync(join(filePath, 'swagger-spec.json'), JSON.stringify(document));
  }
	
	fs.writeFileSync(join(filePath, 'swagger-spec.json'), JSON.stringify(document));
	
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(80);
}

bootstrap();

console.log(`                                    .-+*#%%%%%%%#*=:.                                     
                                 :+@@@@@@@@@@@@@@@@@@@#+.                                 
                               -#@@@@@@@@@@@@@@@@@@@@@@@@#:                               
                              #@@@@@@@@@@@@@@@@@@@@@@@@@@@@*                              
                             *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%.                            
                            -@@@@@@@@@@@@@%%%###**%*%##%#%%%@@*                           
                            %@@@@@@@@@%%###****#*#*+*+**##%*#*%+                          
                           -@@@@@@@@%*##*=:..     ....... .-+##@.                         
                           *@@@@@%####=: .......       .....  *#=                         
                           +@@@%###*:     ...    .     .  ..  :#.   ..                    
                           =@@####-     . .:---:            ...=   ::                     
                           -@#*##-      . :+#%%+-      :+*%%::=.   :.                     
                            **##-   ..    .:==++      ..=+++:  +   .:                     
                             **#.   +.                -: .     +   .:                     
                              :*    +.  .        .     .-    ..+  ::                      
                               .+   :-..-:      +.  .   =    .-: :.                       
                                +    =:....   -. :.   .-:.  .=:  -                        
                                +    ::=:..  - ::.     ..= .=:   :                        
                            .:-==    :  :=-.     .:::-===:.--    :                        
                        -+#@@@@%     .    .==:.....      :=-. ...                         
                      =@@@@@@@@=            .==-: .....:=#=  :                            
                    =@@@@@@@@@=    -:.         .---:+#%@@@@%+.                            
                :=*#@@@@@@@@@@@@%##:            ..  .*#@@@@@@@#:                          
            .:=#@@@@@@@@@@@@@@@@@@@@#=:   .        :=#@@@@@@@@@@@%#*+:                    
         :*%@@@@@@@@@@@@@@@@@@@@@@@@@@@#####*+***%@@@@@@@@@@@@@@@@@@@@@%#*:
`);