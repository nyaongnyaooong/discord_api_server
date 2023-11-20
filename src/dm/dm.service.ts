import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Dm } from 'src/entities/dm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DmService {
  private readonly s3: AWS.S3;

  constructor(
    @InjectRepository(Dm)
    private dmRepository: Repository<Dm>,
  ) {
    AWS.config.update({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    this.s3 = new AWS.S3();
  }

  receiverList = async (userId: number) => {
    const list = await this.dmRepository
      .createQueryBuilder('dm')
      .leftJoin('dm.receiver', 'receiver') // member와 user와 left join
      .select(['dm.receiver_Id', 'receiver.nickname', 'receiver.avatar', 'receiver.createdAt']) // record들 중에서 member의 모든 컬럼과 user의 특정 컬럼만 가져옴
      .where('dm.sender_Id = :userId', { userId: userId })
      .groupBy('dm.receiver_Id')
      .getMany();

    return list;
  }

  getDmList = async (userId: number, targetId: number) => {
    const list = await this.dmRepository.find({
      where: [
        { sender_Id: userId },
        { receiver_Id: targetId }
      ]
    })

    return this.dmRepository.find({
      where: [
        { sender_Id: userId },
        { receiver_Id: targetId }
      ]
    })
  }
}
