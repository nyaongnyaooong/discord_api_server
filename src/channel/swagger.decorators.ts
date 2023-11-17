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
    ApiBadRequestResponse({
      description: '올바르지 않은 형식의 요청입니다.',
      schema: {
        example: {
          message: 'BAD_REQUEST',
          statusCode: HttpStatus.BAD_REQUEST
        },
      },
    }),
  );
}

export function SwaggerChannelPatch() {
  return applyDecorators(
    ApiOperation({
      summary: '채널 업데이트 API',
      description: '채널의 속성을 업데이트합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 채널이 업데이트되었음을 의미합니다.',
      type: ChatChannel
    }),
    ApiBadRequestResponse({
      description: '올바르지 않은 형식의 요청입니다.',
      schema: {
        example: {
          message: 'BAD_REQUEST',
          statusCode: HttpStatus.BAD_REQUEST
        },
      },
    }),
  );
}

export function SwaggerChannelDelete() {
  return applyDecorators(
    ApiOperation({
      summary: '채널 삭제 API',
      description: '채널을 서버에서 삭제합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 채널이 삭제되었음을 의미합니다.',
      type: ChatChannel
    }),
    ApiBadRequestResponse({
      description: '올바르지 않은 형식의 요청입니다.',
      schema: {
        example: {
          message: 'BAD_REQUEST',
          statusCode: HttpStatus.BAD_REQUEST
        },
      },
    }),
  );
}
