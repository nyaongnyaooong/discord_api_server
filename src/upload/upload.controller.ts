import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/user/security/auth.guard";
import { SwaggerUploadPost } from "./swagger.decorators";
import { UploadService } from "./upload.service";



@ApiTags('Upload API')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) { }

  @Post()
  @SwaggerUploadPost()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadChatFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file, '/chats')
  }
}