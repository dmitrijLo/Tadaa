import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { EventStatus, EventMode, DrawRule } from '@tadaa/shared';
import { User } from '../../users/entities/user.entity';
import { Guest } from '../../guests/entities/guest.entity';
import { Assignment } from './assignment.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'host_id' })
  hostId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  budget: number;

  @Column()
  currency: string;

  @Column({ type: 'enum', enum: EventStatus })
  status: EventStatus;

  @Column({ name: 'event_mode', type: 'enum', enum: EventMode })
  eventMode: EventMode;

  @Column({ name: 'draw_rule', type: 'enum', enum: DrawRule })
  drawRule: DrawRule;

  @Column({ name: 'event_date', type: 'timestamp', nullable: true })
  eventDate: Date;

  @Column({ name: 'invitation_date', type: 'timestamp', nullable: true })
  invitationDate: Date;

  @Column({ name: 'draft_date', type: 'timestamp', nullable: true })
  draftDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.hostedEvents, { nullable: false })
  @JoinColumn({ name: 'host_id' })
  host: User;

  @OneToMany(() => Guest, (guest) => guest.event, { cascade: true })
  guests: Guest[];

  @OneToMany(() => Assignment, (assignment) => assignment.event, {
    cascade: true,
  })
  assignments: Assignment[];
}
