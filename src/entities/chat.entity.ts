import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatChannel } from "./chat.channel.entity";
import { User } from "./user.entity";

@Entity()
export class Chat {
  @ApiProperty({ description: '채팅 id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '채팅 발신 유저 id' })
  @PrimaryColumn()
  sender_Id: number;

  @ApiProperty({ description: '채팅 타입 (text or image)' })
  @Column()
  type: string;

  @ApiProperty({ description: '채팅 소속 채널 id' })
  @Column()
  channel_id: number;

  @ApiProperty({ description: '채팅 내용' })
  @Column()
  content: string;

  @ApiProperty({ description: '채팅 생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: '채팅 마지막 업데이트일' })
  @UpdateDateColumn()
  updatedAt: Date;

  // @ApiProperty({ description: '채팅 삭제일' })
  @DeleteDateColumn()
  deletedAt: Date | null;


  
  @ManyToOne(() => User, user => user.chat)
  @JoinColumn({name: 'sender_Id'})
  user: User;

  @ManyToOne(() => ChatChannel, chatChannel => chatChannel.chat)
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  chatChannel: ChatChannel;
}