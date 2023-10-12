import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServerEntity } from "./server.entity";

@Entity()
export class VoiceChannel {
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

  

  @ManyToOne(() => ServerEntity, server => server.voiceChannel)
  @JoinColumn({ name: 'server_id', referencedColumnName: 'id' })
  server: ServerEntity;
}