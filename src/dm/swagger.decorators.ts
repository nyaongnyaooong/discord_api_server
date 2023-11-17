import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Dm } from 'src/entities/dm.entity';
import { UserListDto } from './dto/user.list.dto';


export function SwaggerDmGetUserList() {
  return applyDecorators(
    ApiOperation({
      summary: 'DM 유저 리스트 API',
      description: 'DM을 주고 받았던 유저 리스트를 반환합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 리스트를 반환합니다.',
      type: [UserListDto]
    }),
    ApiUnauthorizedResponse({
      description: '로그인하지않아 유저정보가 없습니다.',
      schema: {
        example: {
          message: 'UNAUTHORIZED',
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
  );
}

export function SwaggerDmGetListId() {
  return applyDecorators(
    ApiOperation({
      summary: 'DM 리스트 API',
      description: '특정 유저와의 DM 내역을 반환합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 리스트를 반환합니다.',
      // type: ChannelListDto
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

export function SwaggerDmPatchId() {
  return applyDecorators(
    ApiOperation({
      summary: 'DM 유저 리스트 API',
      description: 'DM을 주고 받았던 유저 리스트를 반환합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 리스트를 반환합니다.',
      type: [Dm]
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

export function SwaggerDmDeleteId() {
  return applyDecorators(
    ApiOperation({
      summary: '채널 리스트 요청 API',
      description: '요청한 서버의 채널 리스트를 반환합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 채널 리스트를 반환함을 의미합니다.',
      // type: ChannelListDto
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
