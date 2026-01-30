import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { GuestsService } from 'src/guests/guests.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job, UnrecoverableError } from 'bullmq';
import { Guest } from 'src/guests/entities/guest.entity';
import { InviteStatus } from 'src/enums';

interface ProcessResult {
  guestId: string;
  status: 'SENT' | 'FAILED';
}

interface MailJob {
  guest: Guest;
  eventName: string;
  eventId: string;
}

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    private readonly mailService: MailService,
    private readonly guestService: GuestsService,
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

  async process(job: Job<MailJob>): Promise<ProcessResult> {
    const { guest, eventId, eventName } = job.data;
    if (!guest || !eventId || !eventName) {
      const errorMsg = 'Invalid Job Data: guest | eventId | eventName is missing.';
      this.logger.error(errorMsg);

      // BullMQ spezifischer Fehler, damit es nicht versucht die eMail erneut zu versenden.
      throw new UnrecoverableError(errorMsg);
    }
    try {
      this.logger.debug(`Processing mail for guest ${guest.id} (Event: ${eventId})`);
      await this.mailService.sendGuestInvitation(guest, eventName);

      try {
        await this.guestService.markInviteStatusAs(guest.id, InviteStatus.INVITED);
      } catch (dbError) {
        this.logger.warn(`Mail sent, but DB update failed for guest ${guest.id}: ${dbError}`);
      }

      this.eventEmitter.emit('mail.sent', {
        eventId,
        guestId: guest.id,
        status: 'SUCCESS',
      });

      return { guestId: guest.id, status: 'SENT' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send mail to ${guest.email}`, err instanceof Error ? err.stack : err);
      this.eventEmitter.emit('mail.sent', {
        eventId,
        guestId: guest.id,
        status: 'ERROR',
        reason: errorMsg,
      });
      throw err;
    }
  }
}
