import { ApiProperty } from "@nestjs/swagger";

export class UpdateServerDto {
  @ApiProperty({ description: '업데이트할 서버 id' })
  id: number;

  // @ApiProperty({ description: '업데이트할 서버 소유자 id' })
  // ownerId: number;

  @ApiProperty({ description: '업데이트할 서버명' })
  name: string;
}
