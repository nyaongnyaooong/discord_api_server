import { ApiProperty } from "@nestjs/swagger";

export class AvatarUpdateDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  imgFile: any;
}