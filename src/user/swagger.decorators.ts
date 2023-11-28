import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AvatarUpdateDto } from './dto/avatar.update.dto';
import { UserCreatedDto } from './dto/user.created.dto';
import { UserDataDto } from './dto/user.data.dto';

export function SwaggerUserPostRegister() {
  return applyDecorators(
    ApiOperation({
      summary: '회원가입 API',
      description: '새로운 유저를 등록합니다',
    }),
    ApiCreatedResponse({
      description: '회원가입에 성공',
      type: UserCreatedDto
    }),
    ApiUnauthorizedResponse({
      description: '이미 존재하는 이메일 주소',
      schema: {
        example: 'duplicated mail adress',
      },
    })
  );
}

export function SwaggerUserPostLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '로그인 API',
      description: '서버에 로그인 요청 후 토큰을 쿠키형태로 응답 받습니다',
    }),
    ApiAcceptedResponse({
      description: '로그인 성공',
      schema: {
        example: { accessToken: "string" }
      },
    }),
    ApiBadRequestResponse({
      description: '존재하지 않는 메일 주소 입력',
      schema: {
        example: '존재하지 않는 메일주소입니다',
      },
    }),
    ApiUnauthorizedResponse({
      description: '패스워드가 틀림',
      schema: {
        example: '비밀번호가 일치하지 않습니다',
      },
    })
  );
}

export function SwaggerUserPostLogout() {
  return applyDecorators(
    ApiOperation({
      summary: '로그아웃 API',
      description: '서버에 로그아웃을 요청합니다',
    }),
    ApiAcceptedResponse({
      description: '로그아웃 성공',
      schema: {
        example: 'success'
      },
    })
  );
}

export function SwaggerUserPatchAvatar() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 아바타 업데이트 API',
      description: '유저 아바타 이미지를 업데이트합니다 업로드 성공 시 업로드된 이미지 주소를 반환합니다',
    }),
    ApiOkResponse({
      description: '이미지 업로드 성공',
      schema: {
        example: 'https://example.com/image.png'
      },
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: '이미지 파일 데이터',
      type: AvatarUpdateDto,
    })
  );
}

export function SwaggerUserPatchNickName() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 닉네임 업데이트 API',
      description: '유저 닉네임을 업데이트합니다',
    }),
    ApiOkResponse({
      description: '닉네임 업데이트 성공',
      schema: {
        example: 'success'
      },
    })
  );
}

export function SwaggerUserPatchPassword() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 패스워드 업데이트 API',
      description: '유저 패스워드를 수정합니다',
    }),
    ApiOkResponse({
      description: '패스워드 업데이트 성공',
      schema: {
        example: 'https://example.com/image.png'
      },
    })
  );
}

export function SwaggerUserGetAuth() {
  return applyDecorators(
    ApiOperation({
      summary: '토큰 인증 API',
      description: '쿠키에 저장된 JWT 토큰의 유효성을 판단하고, 해당 유저의 정보를 반환합니다',
    }),
    ApiOkResponse({
      description: '토큰 유효성 인증 성공',
      type: UserDataDto
    }),
    ApiUnauthorizedResponse({
      description: 'JWT 토큰에 해당하는 유저의 정보가 없음',
      schema: {
        example: 'user does not exist'
      }
    })
  );
}

export function SwaggerUserDelete() {
  return applyDecorators(
    ApiOperation({
      summary: '회원탈퇴 API',
      description: '유저의 정보를 삭제처리합니다.',
    }),
    ApiOkResponse({
      description: '해당 유저가 탈퇴처리되었습니다.',
      schema: {
        example: {
          generatedMaps: [],
          raw: [],
          affected: 1
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: 'UNAUTHORIZED',
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    })
  );
}
