import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatChannel } from "./chat.channel.entity";
import { ServerMember } from "./server.member.entity";
import { VoiceChannel } from "./voice.channel.entity";

@Entity('server')
export class ServerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @Column()
  name: string;
  
  // 아바타 이미지 주소
  @Column({ default: '' })
  avatar: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  

  @OneToMany(() => ServerMember, serverMember => serverMember.server)
  serverMember: ServerMember[];

  @OneToMany(() => ChatChannel, chatChannel => chatChannel.server)
  chatChannel: ChatChannel[];

  @OneToMany(() => VoiceChannel, voiceChannel => voiceChannel.server)
  voiceChannel: VoiceChannel[];
}