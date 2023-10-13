import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './security/auth.guard';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from 'src/entities/user.entity';
import { ServerService } from 'src/server/server.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDataDto } from './dto/user.data.dto';
import { UpdatePwDto } from './dto/update.pw.dto';


@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {

    return this.userService.register(registerDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<any> {
    // jwt 토큰 생성
    const jwt = await this.authService.createJwt(loginDto);

    res.cookie('accessToken', jwt.accessToken, {
      path: '/',
      httpOnly: true,
      maxAge: 36000000,
      secure: true,
      sameSite: 'strict',
    })
    return res.status(HttpStatus.ACCEPTED).json(jwt);
  }

  @Post('logout')
  logOut(@Req() req: Request, @Res() res: Response) {
    // req.logout();
    res.clearCookie('accessToken', { httpOnly: true })
    return res.send('ok');
  }

  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvata(@Req() req: Request, @UploadedFile() imgFile: Express.Multer.File) {
    const userData = req.user as UserDataDto
    return this.userService.updateAvata(userData, imgFile)
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  async updatePw(@Req() req: Request, @Body() updatePwDto: UpdatePwDto) {
    const userData = req.user as UserDataDto

    return this.userService.updatePw(userData, updatePwDto)
  }


  @Get('auth')
  @UseGuards(JwtAuthGuard)
  isAuth(@Req() req: Request) {
    const { password, createdAt, updatedAt, deletedAt, ...userData } = req.user as User;
    return userData;
  }

}
