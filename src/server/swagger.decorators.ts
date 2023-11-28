import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ServerMember } from 'src/entities/server.member.entity';
import { AvatarUpdateDto } from 'src/user/dto/avatar.update.dto';
import { UserListDto } from './dto/user.list.dto';



export function SwaggerServerPost() {
  return applyDecorators(
    ApiOperation({
      summary: '서버 생성 API',
      description: '새로운 서버를 생성합니다. 로그인 되어있는 유저의 소유로 만들어집니다.',
    }),
    ApiCreatedResponse({
      description: '서버 생성에 성공했습니다. 요청한 유저가 속한 모든 서버 리스트를 배열 형태로 반환합니다.',
      type: [ServerMember]
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: "UNAUTHORIZED",
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
    ApiBadRequestResponse({
      description: '서버이름이 공란입니다.',
      schema: {
        example: 'there is no server name',
      },
    })
  );
}

export function SwaggerServerGet() {
  return applyDecorators(
    ApiOperation({
      summary: '서버 리스트 API',
      description: '요청한 유저가 속한 모든 서버 리스트를 배열 형태로 반환합니다. 유저정보는 쿠키에 저장되어있는 accessToken값으로부터 읽어옵니다.',
    }),
    ApiOkResponse({
      description: '서버 리스트를 성공적으로 불러왔음을 의미합니다.',
      type: [ServerMember]
    })
  );
}

export function SwaggerServerGetUsers() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 리스트 API',
      description: '특정 서버에 속한 모든 유저 리스트를 배열 형태로 반환합니다.',
    }),
    ApiOkResponse({
      description: '유저 리스트를 성공적으로 불러왔음을 의미합니다. ',
      type: [UserListDto]
    }),
    ApiForbiddenResponse({
      description: '유저가 요청한 서버에 속해 있지 않아 리스트를 받아올 권한이 없습니다.',
      schema: {
        example: {
          message: 'FORBIDDEN',
          statusCode: HttpStatus.FORBIDDEN
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: "UNAUTHORIZED",
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
  );
}

export function SwaggerServerGetMembers() {
  return applyDecorators(
    ApiOperation({
      summary: '멤버 리스트 API',
      description: '특정 유저와 같은 서버에 속한 모든 유저 리스트를 배열 형태로 반환합니다.',
    }),
    ApiOkResponse({
      description: '멤버 리스트를 성공적으로 불러왔음을 의미합니다. ',
      type: [UserListDto]
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: "UNAUTHORIZED",
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
  );
}

export function SwaggerServerInvitePost() {
  return applyDecorators(
    ApiOperation({
      summary: '서버 초대 코드 생성 API',
      description: '서버 초대 URL을 생성합니다. 유효시간은 5분입니다.',
    }),
    ApiCreatedResponse({
      description: '성공적으로 URL이 생성되었음을 의미합니다. ',
      type: String
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: "UNAUTHORIZED",
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
    ApiForbiddenResponse({
      description: '초대권한이 없음을 의미합니다.',
      schema: {
        example: {
          message: 'not belong to server',
          statusCode: HttpStatus.FORBIDDEN
        },
      },
    })
  );
}

export function SwaggerServerJoinPost() {
  return applyDecorators(
    ApiOperation({
      summary: '서버 입장 API',
      description: '유저를 서버에 입장 시킵니다.',
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: "UNAUTHORIZED",
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
    ApiNotFoundResponse({
      description: '잘못된 초대코드거나 유효기간이 만료된 코드입니다.',
      schema: {
        example: {
          message: 'code is not valid or has been expired',
          statusCode: HttpStatus.NOT_FOUND
        }
      }
    }),
    ApiForbiddenResponse({
      description: '유저가 이미 서버에 속해있습니다.',
      schema: {
        example: {
          message: 'already joined server',
          statusCode: HttpStatus.FORBIDDEN
        },
      },
    })
  );
}

export function SwaggerServerAvatarPatch() {
  return applyDecorators(
    ApiOperation({
      summary: '서버 아바타 업데이트 API',
      description: '유저 아바타 이미지를 업데이트합니다. 업로드 성공 시 업로드된 이미지 주소를 반환합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 업로드에 성공하였습니다.',
      schema: {
        example: 'https://example.com/image.png'
      },
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '이미지 파일 데이터',
      type: AvatarUpdateDto,
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: "UNAUTHORIZED",
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
    ApiForbiddenResponse({
      description: '서버 속성 변경 권한이 업습니다.',
      schema: {
        example: {
          message: 'FORBIDDEN',
          statusCode: HttpStatus.FORBIDDEN
        },
      },
    })
  );
}

export function SwaggerServerDelete() {
  return applyDecorators(
    ApiOperation({
      summary: '서버 삭제 API',
      description: '서버를 삭제합니다.',
    }),
    ApiOkResponse({
      description: '성공적으로 삭제에 성공하였습니다.',
      schema: {
        example: {
          generatedMaps: [],
          raw: [],
          affected: 1
        }
      },
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: "UNAUTHORIZED",
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    }),
    ApiBadRequestResponse({
      description: '요청 형식이 잘못되었습니다.',
      schema: {
        example: {
          message: 'BAD_REQUEST',
          statusCode: HttpStatus.BAD_REQUEST
        },
      },
    }),
    ApiForbiddenResponse({
      description: '서버 삭제 권한이 업습니다.',
      schema: {
        example: {
          message: 'FORBIDDEN',
          statusCode: HttpStatus.FORBIDDEN
        },
      },
    })
  );
}