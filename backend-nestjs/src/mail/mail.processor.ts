import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { GuestsService } from 'src/guests/guests.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job, UnrecoverableError } from 'bullmq';
import { InviteStatus } from 'src/enums';
import { MailJobData, ProcessResult, ScheduleJobData } from './dto/mail.dto';
import { EventsService } from 'src/events/events.service';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    private readonly mailService: MailService,
    private readonly guestService: GuestsService,
    private readonly eventsService: EventsService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  @OnWorkerEvent('drained')
  onQueueDrained() {
    this.logger.log('All mail jobs finished! Queue is empty.');
    this.eventEmitter.emit('mail.sent', {
      status: 'DONE',
    });
  }

  async process(
    job: Job<MailJobData | ScheduleJobData>,
  ): Promise<ProcessResult | { message: string; queueCount: number }> {
    const { type, eventId } = job.data as ScheduleJobData;

    if (type === 'TRIGGER_INVITES') {
      this.logger.log(`Auto-Trigger: Invite guests for Event ${eventId}`);
      try {
        const event = await this.eventsService.findOne(eventId);
        return this.guestService.inviteGuests(event);
      } catch (err) {
        throw new UnrecoverableError('Event not found');
      }
    }

    if (type === 'TRIGGER_ASSIGNMENTS') {
      this.logger.log(`Auto-Trigger: Sending assignments for Event ${eventId}`);
      try {
        const event = await this.eventsService.findOne(eventId);
        return this.guestService.createAssignmentNotifications(event);
      } catch (err) {
        throw new UnrecoverableError('Event not found');
      }
    }

    const { guest, event, assignmentContext } = job.data as MailJobData;
    if (!guest || !event) {
      const errorMsg = 'Invalid Job Data: guest | event is missing.';
      this.logger.error(errorMsg);

      // BullMQ spezifischer Fehler, damit es nicht versucht die eMail erneut zu versenden.
      throw new UnrecoverableError(errorMsg);
    }

    try {
      this.logger.debug(`Processing mail for guest ${guest.id} (Event: ${event.id})`);
      if (type === 'INVITE') {
        await this.mailService.sendGuestInvitation(guest, event);

        try {
          await this.guestService.markInviteStatusAs(guest.id, InviteStatus.INVITED);
        } catch (dbError) {
          this.logger.warn(`Mail sent, but DB update failed for guest ${guest.id}: ${dbError}`);
        }
      } else if (type === 'ASSIGN') {
        await this.mailService.sendAssignmentMail(guest, event, assignmentContext);
      } else {
        throw new Error(`Unknown Mail Type: ${type}`);
      }

      this.eventEmitter.emit('mail.sent', {
        eventId: event.id,
        guestId: guest.id,
        status: 'SUCCESS',
      });

      return { guestId: guest.id, status: 'SENT' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send mail to ${guest.email}`, err instanceof Error ? err.stack : err);
      this.eventEmitter.emit('mail.sent', {
        eventId: event.id,
        guestId: guest.id,
        status: 'ERROR',
        reason: errorMsg,
      });
      throw err;
    }
  }
}
