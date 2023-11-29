import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatChannel } from "./chat.channel.entity";
import { ServerMember } from "./server.member.entity";
import { VoiceChannel } from "./voice.channel.entity";

@Entity('server')
export class ServerEntity {
  @ApiProperty({ description: '서버 id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '서버 생성 유저 id' })
  @Column()
  ownerId: number;

  @ApiProperty({ description: '서버명' })
  @Column()
  name: string;

  @ApiProperty({ description: '아바타 이미지 URL' })
  @Column({ default: '' })
  avatar: string;

  @ApiProperty({ description: '서버 생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: '마지막 서버 업데이트일' })
  @UpdateDateColumn()
  updatedAt: Date;

  // @ApiProperty({ description: '서버 삭제일' })
  @DeleteDateColumn()
  deletedAt: Date | null;



  @OneToMany(
    () => ServerMember,
    serverMember => serverMember.server,
    { cascade: true }
  )
  serverMember: ServerMember[];

  @OneToMany(() => ChatChannel, chatChannel => chatChannel.server)
  chatChannel: ChatChannel[];

  @OneToMany(() => VoiceChannel, voiceChannel => voiceChannel.server)
  voiceChannel: VoiceChannel[];
}