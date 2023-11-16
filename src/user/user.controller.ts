import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user.register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './security/auth.guard';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from 'src/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDataDto } from './dto/user.data.dto';
import { UpdatePwDto } from './dto/update.pw.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update.profile.dto';
import { SwaggerGetAuth, SwaggerPatchAvatar, SwaggerPatchNickName, SwaggerPatchPassword, SwaggerPostLogin, SwaggerPostLogout, SwaggerPostRegister } from './swagger.decorators';


@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Post('/register')
  @SwaggerPostRegister()
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.userService.register(userRegisterDto);
  }

  @Post('/login')
  @SwaggerPostLogin()
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    // jwt 토큰 생성
    const jwt = await this.authService.createJwt(loginDto);

    res.cookie('accessToken', jwt.accessToken, {
      path: '/',
      httpOnly: true,
      maxAge: 36000000,
      // 추후 https시 secure true 추가
      // secure: true,
      sameSite: 'strict',
    })
    return res.status(HttpStatus.ACCEPTED).json(jwt);
  }

  @Post('logout')
  @SwaggerPostLogout()
  logOut(@Req() req: Request, @Res() res: Response) {
    // req.logout();
    res.clearCookie('accessToken', { httpOnly: true })
    return res.send('success');
  }

  @Patch('avatar')
  @SwaggerPatchAvatar()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvata(@Req() req: Request, @UploadedFile() imgFile: Express.Multer.File) {
    const userData = req.user as UserDataDto
    return this.userService.updateAvata(userData, imgFile)
  }

  @Patch('nickname')
  @SwaggerPatchNickName()
  @UseGuards(JwtAuthGuard)
  async updateNickname(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const userData = req.user as UserDataDto
    return this.userService.updateNickname(+userData.id, updateProfileDto.nickname)
  }

  @Patch('password')
  @SwaggerPatchPassword()
  @UseGuards(JwtAuthGuard)
  async updatePw(@Req() req: Request, @Body() updatePwDto: UpdatePwDto) {
    const userData = req.user as UserDataDto

    return this.userService.updatePw(userData, updatePwDto)
  }

  @Get('auth')
  @SwaggerGetAuth()
  @UseGuards(JwtAuthGuard)
  isAuth(@Req() req: Request) {
    console.log('유저데이터?', req.user)
    const { id, mail, nickname, avatar, createdAt, updatedAt } = req.user as User;
    const userData: UserDataDto = {
      id,
      mail,
      nickname,
      avatar,
      createdAt,
      updatedAt
    }
    return userData;
  }
}


