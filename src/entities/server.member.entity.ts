import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ServerEntity } from "./server.entity";
import { User } from "./user.entity";

@Entity()
export class ServerMember {
  @PrimaryColumn()
  user_Id: number;

  @PrimaryColumn()
  server_Id: number;

  @CreateDateColumn({ type: 'timestamp' })
  joinedAt: Date;


  
  @ManyToOne(() => User, user => user.serverMember)
  @JoinColumn({name: 'user_Id'})
  user: User;

  @ManyToOne(() => ServerEntity, server => server.serverMember)
  @JoinColumn({name: 'server_Id'})
  server: ServerEntity;
}