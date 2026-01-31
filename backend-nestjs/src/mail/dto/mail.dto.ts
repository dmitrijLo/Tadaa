export type MailType = 'INVITE' | 'ASSIGN';
export type ScheduleType = 'TRIGGER_INVITES' | 'TRIGGER_ASSIGNMENTS';

export interface MailJobData {
  type: MailType;
  guest: MailGuestData;
  event: MailEventData;
  assignmentContext: AssignmentContext;
}

export interface ScheduleJobData {
  type: ScheduleType;
  eventId: string;
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

export interface MailGuestData {
  id: string;
  name: string;
  email: string;
}

export interface MailEventData {
  id: string;
  name: string;
  host: string;
  description: string;
  eventDate: Date;
  budget: number;
  currency: string;
  draftDate: Date;
  eventMode: string;
  drawRule: string;
}

export interface AssignmentContext {
  recipientName?: string;
  pickOrder?: number;
}
