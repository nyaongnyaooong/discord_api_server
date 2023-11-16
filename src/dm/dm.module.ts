import { Module } from '@nestjs/common';
import { DmService } from './dm.service';
import { DmController } from './dm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dm } from 'src/entities/dm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dm]),
  ],
  controllers: [DmController],
  providers: [DmService],
})
export class DmModule {}
