import { ApiProperty } from "@nestjs/swagger";

export class UserRegisterDto {
  @ApiProperty({ description: '로그인 시 사용할 메일 주소' })
  mail: string;

  @ApiProperty({ description: '유저 닉네임' })
  nickname: string;

  @ApiProperty({ description: '유저 패스워드' })
  password: string;
}
