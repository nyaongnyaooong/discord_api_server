import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/user/security/auth.guard";
import { UploadService } from "./upload.service";



@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadChatFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file, '/chats')
  }
}