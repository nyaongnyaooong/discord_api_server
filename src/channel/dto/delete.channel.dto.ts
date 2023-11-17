import { ApiProperty } from "@nestjs/swagger";

export class DeleteChannelDto {
  @ApiProperty({ description: '삭제할 채널의 타입' })
  type: 'text' | 'voice';

  @ApiProperty({ description: '삭제할 채널의 id' })
  id: number;
}