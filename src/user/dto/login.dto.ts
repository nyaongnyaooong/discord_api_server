import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: '로그인 요청할 유저 메일 주소' })
  mail: string;
  
  @ApiProperty({ description: '로그인 요청할 유저 패스워드' })
  password: string;
}