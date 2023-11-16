import { ApiProperty } from "@nestjs/swagger";

export class CreateServerDto {
  @ApiProperty({ description: '생성할 서버명' })
  servername: string;
}
