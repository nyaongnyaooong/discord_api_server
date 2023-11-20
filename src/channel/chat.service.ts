import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from 'src/entities/chat.entity';


@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) { }

  async findChat(serverId: number, channelId: number) {
    const chatData = await this.chatRepository.find({
      where: {channel_id: channelId}
    })
  }

}
