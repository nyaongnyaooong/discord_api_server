import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServerDto } from './dto/create.server.dto';
import { UpdateServerDto } from './dto/update.server.dto';
import { ServerEntity } from 'src/entities/server.entity';
import { ServerMember } from 'src/entities/server.member.entity';
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';

@Injectable()
export class ServerService {
  private readonly s3: AWS.S3;

  constructor(
    @InjectRepository(ServerEntity)
    private serverRepository: Repository<ServerEntity>,
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
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

  invitationCode = [];

  // 서버 생성
  async create(userid: number, servername: string) {

    // DB에 서버 생성
    const newServer = await this.serverRepository.save({ ownerId: +userid, name: servername });

    // DB에 생성한 서버에 멤버로 추가
    return await this.serverMemberRepository.save({ user_Id: userid, server_Id: newServer.id })
  }

  // 유저가 속한 서버 리스트
  async findUserServers(userid: number) {
    return await this.serverMemberRepository.find({ where: { user_Id: userid }, relations: { server: true, }, });
  }

  // 서버에 속한 유저 리스트
  async findServerUsers(reqUserId: number, serverId: number) {
    const userList = await this.serverMemberRepository.createQueryBuilder('member') // 서버멤버 레포지토리를 member라 명명
      .leftJoin('member.user', 'user') // member와 user와 left join
      .select(['member', 'user.id', 'user.mail', 'user.nickname', 'user.avatar', 'user.createdAt', 'user.updatedAt']) // record들 중에서 member의 모든 컬럼과 user의 특정 컬럼만 가져옴
      .where('member.server_Id = :server_Id', { server_Id: serverId }) // 요청한 서버 id에 속한 유저, member 레코드들을 가져옴
      .getMany()

    const isMember = userList.filter(member => reqUserId === member.user_Id);
    if (!isMember.length) throw new HttpException({
      message: 'FORBIDDEN',
      statusCode: HttpStatus.FORBIDDEN
    }, HttpStatus.FORBIDDEN);

    return userList;
  }

  // 유저가 속한 모든 서버의 모든 멤버들
  async findMembers(userId: number) {
    const servers = await this.findUserServers(userId);

    const serverMembers = await Promise.all(
      servers.map(async (server) => {
        return await this.findServerUsers(userId, server.server_Id);
      })
    );

    return serverMembers;
  }

  // 입장 코드 생성
  async createJoinCode(userId: number, serverId: number) {
    const servers = await this.findUserServers(userId);

    const isBelong = servers.filter(server => server.server_Id === serverId);
    if (isBelong.length < 1) throw new HttpException({
      message: 'not belong to server',
      statusCode: HttpStatus.FORBIDDEN
    }, HttpStatus.FORBIDDEN)

    const code = this.randomString(10)
    this.invitationCode[code] = serverId;
    setTimeout(() => {
      delete this.invitationCode[code];
    }, 1000 * 60 * 5);

    return code;
  }

  // 유저 서버 입장
  async joinServer(userId: number, inviteCode: string) {

    // 입장 코드가 유효하지 않음
    const reqServerId = this.invitationCode[inviteCode];
    if (!reqServerId) throw new HttpException({
      message: 'code is not valid or has been expired',
      statusCode: 404
    }, HttpStatus.NOT_FOUND)

    // 해당 서버에 유저가 속했는지 확인
    const alreadyJoined = await this.serverMemberRepository.findOne({
      where: {
        user_Id: userId,
        server_Id: reqServerId
      }
    })

    // 이미 서버에 일원
    if (alreadyJoined) throw new HttpException({
      message: 'already joined server',
      statusCode: HttpStatus.FORBIDDEN
    }, HttpStatus.FORBIDDEN)

    await this.serverMemberRepository.save({
      user_Id: userId,
      server_Id: reqServerId
    });

    return {
      message: 'joined server'
    }
  }

  // 서버명 수정
  async updateServer(updateServerDto: UpdateServerDto) {
    const server = await this.serverRepository.findOne({
      where: {
        id: updateServerDto.id
      }
    })

    if (server.name === updateServerDto.name) return false;

    server.name = updateServerDto.name

    return this.serverRepository.save(server);
  }

  // 서버 삭제
  async removeServer(id: number) {
    this.serverRepository.softDelete({ id });
  }

  // 서버 아바타 수정
  async updateAvatar(userId: number, serverId: number, newAvatar: Express.Multer.File) {
    // 아바타 수정 요청한 서버 레코드를 db에서 검색
    const server = await this.serverRepository.findOne({ where: { id: serverId } })

    // 요청한 유저와 서버 주인이 일치하는지 확인
    if (server.ownerId !== userId) throw new HttpException({
      message: 'FORBIDDEN',
      statusCode: HttpStatus.FORBIDDEN
    }, HttpStatus.FORBIDDEN)

    // 저장할 파일명
    const filename = server.toString();
    // 저장할 폴더
    const folder = 'serverAvatars';

    // s3 업로드
    const reqUpload = await this.s3
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET + '/' + folder,
        ACL: 'public-read',
        Key: filename,
        Body: newAvatar.buffer,
      })
      .promise();

    const imgUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${folder}/${filename}`;

    server.avatar = imgUrl;

    // 유저 레코드 업데이트
    this.serverRepository.save(server);

    return imgUrl;
  }

  randomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  update(id: number, updateServerDto: UpdateServerDto) {
    return `This action updates a #${id} server`;
  }

  async deleteServer(userId: number, serverId: number) {
    if (isNaN(userId) || isNaN(serverId)) throw new HttpException({
      message: 'BAD_REQUEST',
      statusCode: HttpStatus.BAD_REQUEST
    }, HttpStatus.BAD_REQUEST);

    const record = await this.serverRepository.findOne({ where: { id: serverId } });
    if (record.ownerId !== userId) throw new HttpException({
      message: 'FORBIDDEN',
      statusCode: HttpStatus.FORBIDDEN
    }, HttpStatus.FORBIDDEN);

    return await this.serverRepository.softDelete({ id: serverId });
  }

  // 서버 id로 유저 record 검색
  async findOneById(serverId: number) {
    return this.serverRepository.findOne({ where: { id: serverId } });
  }
}
