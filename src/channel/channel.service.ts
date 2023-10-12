import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChatChannel } from 'src/entities/chat.channel.entity';
import { VoiceChannel } from 'src/entities/voice.channel.entity';


@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChatChannel)
    private readonly chatChannelRepository: Repository<ChatChannel>,
    @InjectRepository(VoiceChannel)
    private readonly voiceChannelRepository: Repository<VoiceChannel>,
  ) { }

  async findChatChannel(userId: number, serverId: number) {
    const chatChannels = await this.chatChannelRepository.find({ where: { serverId } });
    return chatChannels;
  }

  async findVoiceChannel(userId: number, serverId: number) {
    const voiceChannels = await this.voiceChannelRepository.find({ where: { serverId } });
    return voiceChannels;
  }

  async create(createChannelDto: CreateChannelDto) {
    const { type, ...newChannelData } = createChannelDto

    if (createChannelDto.type === 'text') {
      return await this.chatChannelRepository.save(newChannelData)
    }
    if (createChannelDto.type === 'voice') {
      return await this.voiceChannelRepository.save(newChannelData)
    }
  }



  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
