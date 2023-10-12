import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { JwtAuthGuard } from 'src/user/security/auth.guard';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { UserDataDto } from 'src/user/dto/user.data.dto';


@Controller('server')
export class ServerController {
  constructor(
    private readonly serverService: ServerService,

  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: Request, @Body() createServerDto: CreateServerDto) {
    const userData = req.user as User;
    return this.serverService.create(+userData.id, createServerDto.servername);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findUserServer(@Req() req: Request) {
    const userData = req.user as User;
    const serverData = await this.serverService.findUserServers(+userData.id);
    return { userData, serverData };
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard)
  async users(@Req() req: Request, @Query('serverId') serverId: number) {
    const userData = req.user as UserDataDto

    return await this.serverService.findServerUsers(+userData.id, +serverId);
  }

  @Post('/invite')
  @UseGuards(JwtAuthGuard)
  createJoinCode(@Req() req: Request, @Body('serverId') serverId: number) {
    const userData = req.user as User;

    return this.serverService.createJoinCode(userData.id, +serverId);
  }

  @Post('/join')
  @UseGuards(JwtAuthGuard)
  joinServer(@Req() req: Request, @Body('inviteCode') inviteCode: string) {
    const userData = req.user as User;
    return this.serverService.joinServer(userData.id, inviteCode);
  }

}
