import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const prefix = '/api';
  app.setGlobalPrefix(prefix);

  // next 서버만 cors 허용
  app.enableCors({
    origin: [process.env.CLIENT_SERVER_URL],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  });
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(cookieParser());

  const options = new DocumentBuilder()
    .setTitle('title')
    .setVersion('1.0')
    .setDescription('desc')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(prefix + '/api-docs', app, document, {
    customSiteTitle: 'sad',
  });

  await app.listen(port);
  console.log('listening on port ' + port);

  // app.useWebSocketAdapter(new IoAdapter(app));
}
bootstrap();
