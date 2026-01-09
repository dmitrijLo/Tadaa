import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guest } from '../../guests/entities/guest.entity';
import { InterestOption } from './interest-option.entity';

@Entity('guest_interests')
export class GuestInterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'guest_id' })
  guestId: string;

  @Column({ name: 'interest_option_id' })
  interestOptionId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Guest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guest_id' })
  guest: Guest;

  @ManyToOne(() => InterestOption, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'interest_option_id' })
  interestOption: InterestOption;
}
