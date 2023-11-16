import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatChannel } from 'src/entities/chat.channel.entity';
import { VoiceChannel } from 'src/entities/voice.channel.entity';
import { ChatService } from './chat.service';
import { Chat } from 'src/entities/chat.entity';
import { ServerService } from 'src/server/server.service';
import { ServerMember } from 'src/entities/server.member.entity';
import { ServerEntity } from 'src/entities/server.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ChatChannel, VoiceChannel, Chat, ServerMember, ServerEntity]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChatService, ServerService],
})
export class ChannelModule { }
