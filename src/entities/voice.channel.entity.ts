import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServerEntity } from "./server.entity";

@Entity()
export class VoiceChannel {
  @ApiProperty({ description: '채널 id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '소속된 서버 id' })
  @PrimaryColumn()
  serverId: number;
  
  @ApiProperty({ description: '채널명' })
  @Column()
  name: string;

  @ApiProperty({ description: '채널 생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: '마지막 채널 업데이트일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '채널 삭제일' })
  @DeleteDateColumn()
  deletedAt: Date | null;

  

  @ManyToOne(() => ServerEntity, server => server.voiceChannel)
  @JoinColumn({ name: 'server_id', referencedColumnName: 'id' })
  server: ServerEntity;
}