import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { UserDataDto } from './dto/user.data.dto';
import * as AWS from 'aws-sdk';


@Injectable()
export class UserService {
  private readonly s3: AWS.S3;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    @InjectRepository(User)
    private authRepository: Repository<User>,
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

  /**
  *  패스워드 해시화 함수  
  * @param {string} password 해시화 전 패스워드
  * @returns 해시화된 패스워드 반환
  */
  async HashPassword(password: string) {
    // 솔팅 횟수
    const saltRounds = +this.configService.get<number>('SALT_ROUNDS');

    // 패스워드 해시화
    return await bcrypt.hash(password, saltRounds);
  }

  async register(registerDto: RegisterDto) {
    // 중복된 메일주소가 있는지 확인
    const duplicatedUser = await this.authRepository.findOne({ where: { mail: registerDto.mail } });
    if (duplicatedUser) throw new UnauthorizedException('duplicated mail adress');

    // 패스워드 해시화
    registerDto.password = await this.HashPassword(registerDto.password)

    // db에 저장
    return this.authRepository.save(registerDto);
  }

  async login(loginDto: LoginDto) {
    const userFind = await this.authRepository.findOne({ where: { mail: loginDto.mail } });
    // 일치하는 유저를 찾을 수 없음
    if (!userFind) throw new NotFoundException();

    const jwt = this.authService.createJwt(loginDto);

    return jwt
  }

  async findOne(userid: number) {
    return this.authRepository.findOne({ where: { id: userid } })
  }

  async updateAvata(userData: UserDataDto, newAvatar: Express.Multer.File) {
    const key = userData.id.toString();

    await this.s3
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET + '/avatar',
        ACL: 'public-read',
        Key: key,
        Body: newAvatar.buffer,
      })
      .promise();

    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/avatar/${key}`;
  }
}
