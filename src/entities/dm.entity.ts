import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Dm {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  sender_Id: number;

  @Column()
  receiver_Id: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
  


  @CreateDateColumn({ type: 'timestamp' })
  sendAt: Date;

  @ManyToOne(() => User, user => user.dm)
  @JoinColumn({name: 'sender_Id'})
  sender: User;

  @ManyToOne(() => User, user => user.dm2)
  @JoinColumn({name: 'receiver_Id'})
  receiver: User;
}