import { ApiProperty } from "@nestjs/swagger";
import { UserDataDto } from "src/user/dto/user.data.dto";

export class UserListDto {
  @ApiProperty({ description: '유저 id' })
  user_Id: number;

  @ApiProperty({ description: '유저 소속 서버 id' })
  server_Id: number;

  @ApiProperty({ description: '서버 소속일' })
  joinedAt: Date;

  @ApiProperty({ description: '유저 Entity' })
  user: UserDataDto;
}