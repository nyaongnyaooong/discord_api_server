import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
  private readonly s3: AWS.S3;

  constructor() {
    AWS.config.update({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    this.s3 = new AWS.S3();
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    const key = Date.now() + file.originalname;

    await this.s3
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET + folder,
        ACL: 'public-read',
        Key: key,
        Body: file.buffer,
      })
      .promise();

    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com${folder}/${key}`;
  }
}
