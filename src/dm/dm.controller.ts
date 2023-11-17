import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserDataDto } from 'src/user/dto/user.data.dto';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-dm.dto';
import { UpdateDmDto } from './dto/update-dm.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/user/security/auth.guard';
import { SwaggerDmDeleteId, SwaggerDmGetListId, SwaggerDmGetUserList, SwaggerDmPatchId } from './swagger.decorators';

@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  // @Post()
  // create(@Body() createDmDto: CreateDmDto) {
  //   return this.dmService.create(createDmDto);
  // }

  @Get('user/list')
  @SwaggerDmGetUserList()
  @UseGuards(JwtAuthGuard)
  receiverList(@Req() req: Request) {
    const userData = req.user as UserDataDto;

    return this.dmService.receiverList(+userData.id);
  }

  // @Get('list/:id')
  // @SwaggerDmGetListId()
  // @UseGuards(JwtAuthGuard)
  // getDmList(@Req() req: Request, @Param('id') id: string) {
  //   const userData = req.user as UserDataDto;

  //   return this.dmService.getDmList(+userData.id, +id);
  // }

  // @Patch(':id')
  // @SwaggerDmPatchId()
  // update(@Param('id') id: string, @Body() updateDmDto: UpdateDmDto) {
  //   return this.dmService.update(+id, updateDmDto);
  // }

  // @Delete(':id')
  // @SwaggerDmDeleteId()
  // remove(@Param('id') id: string) {
  //   return this.dmService.remove(+id);
  // }
}
