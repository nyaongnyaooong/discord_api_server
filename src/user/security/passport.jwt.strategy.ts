import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy as StrategyJwt, VerifiedCallback } from 'passport-jwt';
import { Strategy as StrategyLocal } from 'passport-local';
import { PassportStrategy } from "@nestjs/passport";
import { Payload } from "./payload.interface";
import { Request } from 'express';
import { UserService } from "../user.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(StrategyJwt) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // console.log(req?.cookies)

          return req?.cookies?.accessToken;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY || 'secret key for test',
    });
  }

  // 검증 성공 시 validate 함수 실행하여 리턴값을 request.user에 저장, 실패 시는 에러
  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.userService.findOneById(payload.id);

    // done은 검증 후 데이터를 어떻게 처리할 것인지에 대한 함수
    if (!user) return done(new UnauthorizedException({ message: 'user does not exist' }), false);

    // 패스워드와 같은 데이터를 제거
    const { password, deletedAt, ...userData } = user;

    return done(null, userData);
  }
}
