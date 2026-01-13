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
import { InviteStatus } from '../../enums';
import { Event } from '../../events/entities/event.entity';
import { Assignment } from '../../events/entities/assignment.entity';

@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'note_for_giver', type: 'text', nullable: true })
  noteForGiver: string;

  @Column({ name: 'decline_message', type: 'text', nullable: true })
  declineMessage: string;

  @Column({ name: 'invite_token', unique: true })
  inviteToken: string;

  @Column({ name: 'invite_status', type: 'enum', enum: InviteStatus })
  inviteStatus: InviteStatus;

  @Column({ name: 'received_at', type: 'timestamp', nullable: true })
  receivedAt: Date;

  @Column({ name: 'opened_at', type: 'timestamp', nullable: true })
  openedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Event, (event) => event.guests, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @OneToMany(() => Assignment, (assignment) => assignment.giverGuest, {
    cascade: true,
  })
  givenAssignments: Assignment[];

  @OneToMany(() => Assignment, (assignment) => assignment.receiverGuest, {
    cascade: true,
  })
  receivedAssignments: Assignment[];
}
