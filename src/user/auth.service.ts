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
    private authRepository: Repository<User>,
  ) { }

  async createJwt(loginDto: LoginDto) {
    const userFind = await this.authRepository.findOne({ where: { mail: loginDto.mail } });
    // 존재하지 않는 메일주소
    if (!userFind) throw new UnauthorizedException('존재하지 않는 메일주소입니다');

    const validatePassword = await bcrypt.compare(loginDto.password, userFind.password)
    // 비밀번호 불일치
    if (!validatePassword) throw new UnauthorizedException('비밀번호가 일치하지 않습니다');

    // payload 생성
    const payload: Payload = {
      id: userFind.id,
      mail: userFind.mail,
    }

    // jwt 반환
    return { accessToken: this.jwtService.sign(payload, { expiresIn: '7d' }) }
  }

  async tokenValidateUser(payload: Payload) {
    await this.authRepository.findOne({ where: { id: payload.id } })
  }
}
