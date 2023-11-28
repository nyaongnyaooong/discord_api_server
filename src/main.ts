import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const prefix = '/api';
  app.setGlobalPrefix(prefix);

  // next 서버만 cors 허용
  app.enableCors({
    origin: [process.env.CLIENT_SERVER_URL],
    methods: "GET, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  });
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(cookieParser());

  const options = new DocumentBuilder()
    .setTitle('Server API Docs')
    .setVersion('1.0.0')
    .setDescription('디스코드 클론의 비지니스 로직 API 문서입니다.')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(prefix + '/docs', app, document, {
    customSiteTitle: 'Server API Docs',
  });

  await app.listen(port);
  console.log('listening on port ' + port);

  // app.useWebSocketAdapter(new IoAdapter(app));
}
bootstrap();
