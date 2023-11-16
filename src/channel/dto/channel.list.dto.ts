import { ApiProperty } from "@nestjs/swagger";
import { ChatChannel } from "src/entities/chat.channel.entity"
import { VoiceChannel } from "src/entities/voice.channel.entity";

export class ChannelListDto {
  @ApiProperty({ description: '채팅 채널 리스트', type: [ChatChannel] })
  chat: ChatChannel[];

  @ApiProperty({ description: '보이스 채널 리스트', type: [VoiceChannel] })
  voice: VoiceChannel[];
}