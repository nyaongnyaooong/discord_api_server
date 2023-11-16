import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ServerEntity } from "./server.entity";
import { User } from "./user.entity";

@Entity()
export class ServerMember {
  @ApiProperty({ description: '유저 고유 ID' })
  @PrimaryColumn()
  user_Id: number;

  @ApiProperty({ description: '서버 고유 ID' })
  @PrimaryColumn()
  server_Id: number;

  @ApiProperty({ description: '해당 유저가 서버에 참가한 날짜' })
  @CreateDateColumn({ type: 'timestamp' })
  joinedAt: Date;


  
  @ManyToOne(() => User, user => user.serverMember)
  @JoinColumn({name: 'user_Id'})
  user: User;

  @ManyToOne(() => ServerEntity, server => server.serverMember)
  @JoinColumn({name: 'server_Id'})
  server: ServerEntity;
}