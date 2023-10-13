import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Dm } from "./dm.entity";
import { ServerMember } from "./server.member.entity";

@Entity()
export class User {
  // 유저 고유 아이디디
  @PrimaryGeneratedColumn()
  id: number;

  // 로그인용 메일 주소
  @Column({ unique: true })
  mail: string;

  // 닉네임
  @Column()
  nickname: string;

  // 암호화된 패스워드
  @Column()
  password: string;

  // 아바타 이미지 주소
  @Column({ default: '' })
  avatar: string;

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