import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { ServerEntity } from "./server.entity";
import { User } from "./user.entity";

@Entity()
export class ChatChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  serverId: number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  

  @ManyToOne(() => ServerEntity, server => server.chatChannel)
  @JoinColumn({ name: 'server_id', referencedColumnName: 'id' })
  server: ServerEntity;

  @OneToMany(() => Chat, chat=> chat.chatChannel)
  chat: Chat;
}