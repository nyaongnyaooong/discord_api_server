import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create.server.dto';
import { JwtAuthGuard } from 'src/user/security/auth.guard';
import { Request } from 'express';
import { UserDataDto } from 'src/user/dto/user.data.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerServerAvatarPatch, SwaggerServerDelete, SwaggerServerGet, SwaggerServerGetMembers, SwaggerServerGetUsers, SwaggerServerInvitePost, SwaggerServerJoinPost, SwaggerServerPost } from './swagger.decorators';


@ApiTags('Server API')
@Controller('server')
export class ServerController {
  constructor(
    private readonly serverService: ServerService,

  ) { }

  @Post()
  @SwaggerServerPost()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() createServerDto: CreateServerDto) {
    const userData = req.user as UserDataDto;

    // 유저 정보가 없음
    if(!userData.id) throw new HttpException('there is no user information', HttpStatus.UNAUTHORIZED);

    // 서버 이름이 없음
    if(!createServerDto.servername) throw new HttpException('there is no server name', HttpStatus.BAD_REQUEST);

    // 새로운 서버 생성
    await this.serverService.create(+userData.id, createServerDto.servername);
    // 새로운 서버 리스트 전달
    return await this.serverService.findUserServers(+userData.id);
  }

  // 유저의 서버 list
  @Get()
  @SwaggerServerGet()
  @UseGuards(JwtAuthGuard)
  async findUserServer(@Req() req: Request) {
    const userData = req.user as UserDataDto;

    const serverData = await this.serverService.findUserServers(+userData.id);
    console.log(serverData)
    return { userData, serverData };
  }

  @Get('/users')
  @SwaggerServerGetUsers()
  @UseGuards(JwtAuthGuard)
  async users(@Req() req: Request, @Query('serverId') serverId: number) {
    const userData = req.user as UserDataDto;

    return await this.serverService.findServerUsers(+userData.id, +serverId);
  }

  @Get('/members')
  @SwaggerServerGetMembers()
  @UseGuards(JwtAuthGuard)
  async members(@Req() req: Request) {
    const userData = req.user as UserDataDto;

    return await this.serverService.findMembers(+userData.id);
  }

  @Post('/invite')
  @SwaggerServerInvitePost()
  @UseGuards(JwtAuthGuard)
  createJoinCode(@Req() req: Request, @Body('serverId') serverId: number) {
    const userData = req.user as UserDataDto;

    return this.serverService.createJoinCode(userData.id, +serverId);
  }

  @Post('/join')
  @SwaggerServerJoinPost()
  @UseGuards(JwtAuthGuard)
  joinServer(@Req() req: Request, @Body('inviteCode') inviteCode: string) {
    const userData = req.user as UserDataDto;
    return this.serverService.joinServer(userData.id, inviteCode);
  }

  @Patch('avatar/:serverId')
  @SwaggerServerAvatarPatch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(@Req() req: Request, @Param('serverId') serverId: string, @UploadedFile() imgFile: Express.Multer.File) {
    const userData = req.user as UserDataDto;
    return this.serverService.updateAvatar(+userData.id, +serverId, imgFile);
  }

  @Delete(':serverId')
  @SwaggerServerDelete()
  @UseGuards(JwtAuthGuard)
  async deleteServer(@Req() req: Request, @Param('serverId') serverId: number) {
    const userData = req.user as UserDataDto;
    return this.serverService.deleteServer(+userData.id, +serverId);
  }

}
