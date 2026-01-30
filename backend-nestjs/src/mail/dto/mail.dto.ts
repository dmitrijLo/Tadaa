import { Event } from 'src/events/entities/event.entity';
import { Guest } from 'src/guests/entities/guest.entity';

export type MailType = 'INVITE' | 'ASSIGN';

export interface MailJob {
  type: MailType;
  guest: Guest;
  event: Event;
  assignmentContext?: any;
}

export interface MailSentEvent {
  eventId: string;
  status: 'SUCCESS' | 'ERROR';
  guestId: string;
  reason?: string;
}

export interface ProcessResult {
  guestId: string;
  status: 'SENT' | 'FAILED';
}
