import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { InviteStatus } from '../../enums';
import { Event } from '../../events/entities/event.entity';
import { InterestOption } from 'src/interests/entities/interest-option.entity';

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

  @Column({ name: 'invite_status', type: 'enum', enum: InviteStatus })
  inviteStatus: InviteStatus;

  @Column({ name: 'received_at', type: 'timestamp', nullable: true })
  receivedAt: Date;

  @Column({ name: 'opened_at', type: 'timestamp', nullable: true })
  openedAt: Date;

  @Column({ name: 'pick_order', type: 'int', nullable: true })
  pickOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;
  @Column({ name: 'order_index', type: 'int', nullable: true })
  orderIndex: number | null;

  // ReLations
  // the event this gues belongs to

  @ManyToOne(() => Event, (event) => event.guests, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  // the guest receiving the gift
  @OneToOne(() => Guest, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_recipient_id' })
  assignedRecipient: Guest;

  // the interests submited by the guest
  @ManyToMany(() => InterestOption, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'guest_interests',
    joinColumn: { name: 'guest_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'interest_option_id',
      referencedColumnName: 'id',
    },
  })
  interests: InterestOption[];

  // the no-interest submited by the guest
  @ManyToMany(() => InterestOption, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'guest_no_interests',
    joinColumn: { name: 'guest_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'interest_option_id',
      referencedColumnName: 'id',
    },
  })
  no_interests: InterestOption[];
}
