import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UploadDto } from './dto/upload.dto';


export function SwaggerUploadPost() {
  return applyDecorators(
    ApiOperation({
      summary: '파일 업로드 API',
      description: '채팅 이미지 파일을 업로드합니다. 업로드 성공 시 업로드된 이미지 주소를 반환합니다.',
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
      type: UploadDto,
    }),
    ApiUnauthorizedResponse({
      description: '유저 정보가 없습니다.',
      schema: {
        example: {
          message: "UNAUTHORIZED",
          statusCode: HttpStatus.UNAUTHORIZED
        },
      },
    })
  );
}
