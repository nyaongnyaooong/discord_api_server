import { ApiProperty } from "@nestjs/swagger";

export class UpdatePwDto {
  @ApiProperty({ description: '기존 패스워드' })
  nowPw: string;
  
  @ApiProperty({ description: '새로운 패스워드' })
  newPw: string;
}