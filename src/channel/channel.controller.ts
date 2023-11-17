import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create.channel.dto';
import { UpdateChannelDto } from './dto/update.channel.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/user/security/auth.guard';
import { UserDataDto } from 'src/user/dto/user.data.dto';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerChannelDelete, SwaggerChannelGet, SwaggerChannelPatch, SwaggerChannelPost } from './swagger.decorators';
import { ChannelListDto } from './dto/channel.list.dto';
import { ServerService } from 'src/server/server.service';
import { DeleteChannelDto } from './dto/delete.channel.dto';

@ApiTags('Channel API')
@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly serverService: ServerService,
    private readonly chatService: ChatService
  ) { }

  @Get()
  @SwaggerChannelGet()
  @UseGuards(JwtAuthGuard)
  async findChannel(@Req() req: Request, @Query('serverId') serverId: number) {
    serverId = +serverId;

    const userData = req.user as UserDataDto;

    // 유저가 서버에 속해있지 않음
    const servers = await this.serverService.findUserServers(userData.id);
    const isBelong = servers.filter(server => server.server_Id === serverId);
    if (isBelong.length < 1) throw new HttpException({
      message: 'UNAUTHORIZED',
      statusCode: HttpStatus.UNAUTHORIZED
    }, HttpStatus.UNAUTHORIZED)

    const channels = {
      chat: await this.channelService.findChatChannel(+userData.id, +serverId),
      voice: await this.channelService.findVoiceChannel(+userData.id, +serverId)
    }
    return channels;
  }

  @Post()
  @SwaggerChannelPost()
  @UseGuards(JwtAuthGuard)
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Patch()
  @SwaggerChannelPatch()
  @UseGuards(JwtAuthGuard)
  update(@Req() req: Request, @Body() updateChannelDto: UpdateChannelDto) {
    const userData = req.user as UserDataDto;

    return this.channelService.update(+userData.id, updateChannelDto);
  }

  @Delete()
  @SwaggerChannelDelete()
  @UseGuards(JwtAuthGuard)
  deleteChannel(@Req() req: Request, @Body() deleteChannelDto: DeleteChannelDto) {
    const userData = req.user as UserDataDto;

    return this.channelService.deleteChannel(+userData.id, deleteChannelDto);
  }
}
