import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from "./security/payload.interface";



@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async createJwt(loginDto: LoginDto) {
    const userRecord = await this.verifyUser(loginDto);

    // payload 생성
    const payload: Payload = {
      id: userRecord.id,
      mail: userRecord.mail,
    }

    // jwt 반환
    return { accessToken: this.jwtService.sign(payload, { expiresIn: '7d' }) }
  }

  async tokenValidateUser(payload: Payload) {
    await this.userRepository.findOne({ where: { id: payload.id } })
  }

  /**
   * 유저 검증
   * @param {LoginDto} loginDto 입력한 이메일과 패스워드가 올바른지 검증
   * @returns {User}
  */
  async verifyUser(loginDto: LoginDto) {
    const userRecord = await this.userRepository.findOne({ where: { mail: loginDto.mail } });
    // 존재하지 않는 메일주소
    if (!userRecord) throw new UnauthorizedException('존재하지 않는 메일주소입니다');

    const validatePassword = await bcrypt.compare(loginDto.password, userRecord.password);
    // 비밀번호 불일치
    if (!validatePassword) throw new UnauthorizedException('비밀번호가 일치하지 않습니다');

    return userRecord;
  }
}
