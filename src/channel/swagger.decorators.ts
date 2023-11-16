import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ChatChannel } from 'src/entities/chat.channel.entity';
import { ServerMember } from 'src/entities/server.member.entity';
import { VoiceChannel } from 'src/entities/voice.channel.entity';
import { AvatarUpdateDto } from 'src/user/dto/avatar.update.dto';
import { ChannelListDto } from './dto/channel.list.dto';



export function SwaggerChannelGet() {
  return applyDecorators(
    ApiOperation({
      summary: '채널 리스트 요청 API',
      description: '요청한 서버의 채널 리스트를 반환합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 채널 리스트를 반환함을 의미합니다.',
      type: ChannelListDto
    }),
    ApiUnauthorizedResponse({
      description: '유저가 자신이 속해있지 않은 서버의 채널리스트를 요청했음을 의미합니다.',
      schema: {
        example: {
          message: 'UNAUTHORIZED',
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
  );
}

export function SwaggerChannelPost() {
  return applyDecorators(
    ApiOperation({
      summary: '채널 생성 API',
      description: '새로운 채널을 생성합니다.',
    }),
    ApiCreatedResponse({
      description: '성공적으로 채널이 생성되었음을 의미합니다.',
      type: ChatChannel
    }),
  );
}

export function SwaggerChannelPatch() {
  return applyDecorators(
    ApiOperation({
      summary: '채널 수정 API',
      description: '새로운 서버를 생성합니다. 로그인 되어있는 유저의 소유로 만들어집니다.',
    }),

  );
}

export function SwaggerChannelDelete() {
  return applyDecorators(
    ApiOperation({
      summary: '채널 삭제 API',
      description: '채널을 서버에서 삭제합니다.',
    }),

  );
}
