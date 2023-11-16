import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateChannelDto {
  @ApiProperty({ description: '업데이트할 채널 타입' })
  type: 'text' | 'voice';

  @ApiProperty({ description: '업데이트할 채널 id' })
  id: number;

  @ApiProperty({ description: '새로운 채널명' })
  name: string;
}
