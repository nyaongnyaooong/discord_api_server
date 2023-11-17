import { ApiProperty } from "@nestjs/swagger";

class Receiver {
  @ApiProperty({ description: '유저 닉네임' })
  nickname: string;

  @ApiProperty({ description: '유저 아바타 이미지 URL' })
  avatar: string;

  @ApiProperty({ description: 'DM 생성일' })
  createdAt: Date;
}

export class UserListDto {
  @ApiProperty({ description: 'DM 메세지 상대 유저 id' })
  receiver_Id: number;
  
  @ApiProperty({ description: 'DM 메세지 상대 유저 정보', type: Receiver })
  receiver: {
    nickname: string;
    avatar: string;
    createdAt: Date;
  }
}

