import { ApiProperty } from "@nestjs/swagger";

export class UserDataDto {
  @ApiProperty({ description: '유저 고유 ID' })
  id: number;

  @ApiProperty({ description: '로그인용 메일 주소' })
  mail: string;

  @ApiProperty({ description: '유저 닉네임' })
  nickname: string;
  
  @ApiProperty({ description: '아바타 이미지 파일 주소' })
  avatar: string;

  @ApiProperty({ description: '가입일' })
  createdAt: Date;

  @ApiProperty({ description: '마자믹 수정일' })
  updatedAt: Date;
}
