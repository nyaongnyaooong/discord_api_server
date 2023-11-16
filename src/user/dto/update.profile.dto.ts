import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiProperty({ description: '새로 변경할 닉네임' })
  nickname: string;
}