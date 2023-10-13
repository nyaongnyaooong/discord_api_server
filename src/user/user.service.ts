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
import { UpdatePwDto } from './dto/update.pw.dto';


@Injectable()
export class UserService {
  private readonly s3: AWS.S3;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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



  // 유저 회원가입
  async register(registerDto: RegisterDto) {
    // 중복된 메일주소가 있는지 확인
    const duplicatedUser = await this.userRepository.findOne({ where: { mail: registerDto.mail } });
    if (duplicatedUser) throw new UnauthorizedException('duplicated mail adress');

    // 패스워드 해시화
    registerDto.password = await this.HashPassword(registerDto.password)

    // db에 저장
    return this.userRepository.save(registerDto);
  }

  // 유저 로그인
  async login(loginDto: LoginDto) {
    // JWT 생성하여 return
    return this.authService.createJwt(loginDto);
  }

  // 유저 아바타 이미지 업데이트
  async updateAvata(userData: UserDataDto, newAvatar: Express.Multer.File) {
    // 저장할 파일명
    const filename = userData.id.toString();
    // 저장할 폴더
    const folder = 'avatars';

    // s3 업로드
    const reqUpload = await this.s3
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET + '/' + folder,
        ACL: 'public-read',
        Key: filename,
        Body: newAvatar.buffer,
      })
      .promise();

    console.log(reqUpload);
    const imgUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${folder}/${filename}`;

    // 유저 레코드 검색 및 아바타 이미지 URL 변경
    const user = await this.findOneById(userData.id);
    user.avatar = imgUrl;

    // 유저 레코드 업데이트
    this.userRepository.save(user);

    return imgUrl;
  }

  // 유저 패스워드 업데이트
  async updatePw(userData: UserDataDto, updatePwDto: UpdatePwDto) {
    const verifyData = {
      mail: userData.mail,
      password: updatePwDto.nowPw
    }
    const userRecord = await this.authService.verifyUser(verifyData);
    userRecord.password = await this.HashPassword(updatePwDto.newPw);

    const updatedserRecord = await this.userRepository.save(userRecord);
    const { password, deletedAt, ...userNoPw } = updatedserRecord;
    return userNoPw;
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

  // 유저 id로 유저 record 검색
  async findOneById(userid: number) {
    return this.userRepository.findOne({ where: { id: userid } });
  }
}
