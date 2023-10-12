import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Dm } from "./dm.entity";
import { ServerMember } from "./server.member.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mail: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;


  
  @OneToMany(() => ServerMember, serverMember => serverMember.user)
  serverMember: ServerMember[];

  @OneToMany(() => Chat, chat => chat.user)
  chat: Chat[];

  @OneToMany(() => Dm, dm => dm.sender)
  dm: Dm[];

  @OneToMany(() => Dm, dm => dm.receiver)
  dm2: Dm[];
}