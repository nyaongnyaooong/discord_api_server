import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServerEntity } from 'src/entities/server.entity';
import { ServerMember } from 'src/entities/server.member.entity';
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(ServerEntity)
    private serverRepository: Repository<ServerEntity>,
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
  ) { }

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
      .select(['member', 'user.nickname', 'user.avatar', 'user.createdAt']) // record들 중에서 member의 모든 컬럼과 user의 특정 컬럼만 가져옴
      .where('member.server_Id = :server_Id', { server_Id: serverId }) // 요청한 서버 id에 속한 유저, member 레코드들을 가져옴
      .getMany()

    const isMember = userList.filter(member => reqUserId === member.user_Id);
    if (!isMember.length) throw new UnauthorizedException('user is not member of server');

    return userList;
  }

  // 입장 코드 생성
  async createJoinCode(userId: number, serverId: number) {
    const code = this.randomString(10)
    this.invitationCode[code] = serverId;
    setTimeout(() => {
      delete this.invitationCode[code];
    }, 1000 * 60 * 5)
    return code;
  }

  // 유저 서버 입장
  async joinServer(userId: number, inviteCode: string) {

    const reqServerId = this.invitationCode[inviteCode];
    if (!reqServerId) throw new HttpException('code has been expired.', HttpStatus.BAD_REQUEST)

    // 해당 서버에 유저가 속했는지 확인
    const alreadyJoined = await this.serverMemberRepository.findOne({
      where: {
        user_Id: userId,
        server_Id: reqServerId
      }
    })

    if (alreadyJoined) throw new HttpException('already joined server', HttpStatus.BAD_REQUEST)

    return await this.serverMemberRepository.save({
      user_Id: userId,
      server_Id: reqServerId
    })
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

  remove(id: number) {
    return `This action removes a #${id} server`;
  }
}
