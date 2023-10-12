import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerEntity } from 'src/entities/server.entity';
import { ServerMember } from 'src/entities/server.member.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ServerEntity, ServerMember]),
  ],
  controllers: [ServerController],
  providers: [ServerService],
})
export class ServerModule {}
