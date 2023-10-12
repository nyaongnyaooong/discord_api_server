import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatChannel } from 'src/entities/chat.channel.entity';
import { VoiceChannel } from 'src/entities/voice.channel.entity';
import { ChatService } from './chat.service';
import { Chat } from 'src/entities/chat.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ChatChannel, VoiceChannel, Chat]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChatService],
})
export class ChannelModule { }
