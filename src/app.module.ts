import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { ServerModule } from './server/server.module';
import { ChannelModule } from './channel/channel.module';
import { DmModule } from './dm/dm.module';
import { WebsocketModule } from './websocket/websocket.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    ServerModule,
    ChannelModule,
    DmModule,
    WebsocketModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
