import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Dm } from "./dm.entity";
import { ServerMember } from "./server.member.entity";

@Entity()
export class User {
  @ApiProperty({ description: '유저 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '로그인용 메일 주소' })
  @Column({ unique: true })
  mail: string;

  @ApiProperty({ description: '유저 닉네임' })
  @Column()
  nickname: string;

  @ApiProperty({ description: '암호화된 패스워드' })
  @Column()
  password: string;

  @ApiProperty({ description: '유저가 설정한 아바타 이미지 주소' })
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