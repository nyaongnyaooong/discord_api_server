import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/user/security/auth.guard';
import { UserDataDto } from 'src/user/dto/user.data.dto';
import { ChatService } from './chat.service';

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly chatService: ChatService
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findChannel(@Req() req: Request, @Query('serverId') serverId: number) {
    const userData = req.user as UserDataDto

    const chatChannels = await this.channelService.findChatChannel(+userData.id, +serverId);
    const voiceChannels = await this.channelService.findVoiceChannel(+userData.id, +serverId);
    return { chat: chatChannels, voice: voiceChannels }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get('/chat')
  @UseGuards(JwtAuthGuard)
  async findChat(@Req() req: Request, @Query('serverId') serverId: number, @Query('channelId') channelId: number) {
    const userData = req.user as UserDataDto

    const chatChannels = await this.chatService.findChat(+serverId, +channelId);

    return
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }
}
