import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Guest } from '../../guests/entities/guest.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @Column({ name: 'giver_guest_id' })
  giverGuestId: string;

  @Column({ name: 'receiver_guest_id' })
  receiverGuestId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Event, (event) => event.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Guest, (guest) => guest.givenAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'giver_guest_id' })
  giverGuest: Guest;

  @ManyToOne(() => Guest, (guest) => guest.receivedAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_guest_id' })
  receiverGuest: Guest;
}
