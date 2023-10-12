import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [UploadController],
  providers: [UploadService, ConfigService],
})
export class UploadModule { }
