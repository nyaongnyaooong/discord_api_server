import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create.channel.dto';
import { UpdateChannelDto } from './dto/update.channel.dto';
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
    } else if (createChannelDto.type === 'voice') {
      return await this.voiceChannelRepository.save(newChannelData)
    } else throw new HttpException({
      message: 'BAD_REQUEST',
      statusCode: HttpStatus.BAD_REQUEST
    }, HttpStatus.BAD_REQUEST);
  }



  async findOneById(userId: number, type: 'text' | 'voice', id: number) {
    if (type === 'text') {
      return await this.chatChannelRepository.findOne({ where: { id: id } });
    } else if (type === 'voice') {
      return await this.voiceChannelRepository.findOne({ where: { id: id } });
    } else throw new HttpException({
      message: 'BAD_REQUEST',
      statusCode: HttpStatus.BAD_REQUEST
    }, HttpStatus.BAD_REQUEST);
  }

  async update(userId: number, updateChannelDto: UpdateChannelDto) {
    const channel = await this.findOneById(userId, updateChannelDto.type, updateChannelDto.id);
    channel.name = updateChannelDto.name;
    if (updateChannelDto.type === 'text') return this.chatChannelRepository.save(channel);
    else if (updateChannelDto.type === 'voice') return this.voiceChannelRepository.save(channel);
    else throw new HttpException({
      message: 'BAD_REQUEST',
      statusCode: HttpStatus.BAD_REQUEST
    }, HttpStatus.BAD_REQUEST);
  }

  remove(userId: number, id: number) {
    return `This action removes a #${id} channel`;
  }
}
