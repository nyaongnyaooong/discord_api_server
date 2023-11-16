import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Dm {
  @ApiProperty({ description: 'DM id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'DM 발신 유저 id' })
  @PrimaryColumn()
  sender_Id: number;

  @ApiProperty({ description: 'DM 수신 유저 id' })
  @Column()
  receiver_Id: number;

  @ApiProperty({ description: 'DM 타입 (text or image)' })
  @Column()
  type: string;

  @ApiProperty({ description: 'DM 내용' })
  @Column()
  content: string;
  
  @ApiProperty({ description: 'DM 생성일' })
  @CreateDateColumn({ type: 'timestamp' })
  sendAt: Date;

  @ApiProperty({ description: 'DM 마지막 업데이트일' })
  @UpdateDateColumn()
  updatedAt: Date;

  // @ApiProperty({ description: 'DM 삭제일' })
  @DeleteDateColumn()
  deletedAt: Date | null;



  
  @ManyToOne(() => User, user => user.dm)
  @JoinColumn({name: 'sender_Id'})
  sender: User;

  @ManyToOne(() => User, user => user.dm2)
  @JoinColumn({name: 'receiver_Id'})
  receiver: User;
}