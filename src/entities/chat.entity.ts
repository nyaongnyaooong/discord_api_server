import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatChannel } from "./chat.channel.entity";
import { User } from "./user.entity";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  sender_Id: number;

  @Column()
  type: string;

  @Column()
  channel_id: number;

  @Column()
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;


  
  @ManyToOne(() => User, user => user.chat)
  @JoinColumn({name: 'sender_Id'})
  user: User;

  @ManyToOne(() => ChatChannel, chatChannel => chatChannel.chat)
  @JoinColumn({ name: 'channel_id', referencedColumnName: 'id' })
  chatChannel: ChatChannel;
}