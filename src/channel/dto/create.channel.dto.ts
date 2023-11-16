import { ApiProperty } from "@nestjs/swagger";

export class CreateChannelDto {
  @ApiProperty({ description: '채널을 생성할 서버 id' })
  serverId: number;

  @ApiProperty({ description: '채널명' })
  name: string;

  @ApiProperty({ description: '채팅 타입'})
  type: 'text' | 'voice';
}
