import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { GuestsService } from 'src/guests/guests.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { Guest } from 'src/guests/entities/guest.entity';
import { InviteStatus } from 'src/enums';
import { error } from 'node:console';

interface MailJob {
  guest: Guest;
  eventName: string;
  eventId: string;
}

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);
  private lasProccedEventId = '';

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
      eventId: this.lasProccedEventId,
      status: 'DONE',
    });
  }

  async process(job: Job<MailJob>): Promise<any> {
    const { guest, eventId, eventName } = job.data;
    try {
      await this.mailService.sendGuestInvitation(guest, eventName);
      await this.guestService.markInviteStatusAs(guest.id, InviteStatus.INVITED);
      this.lasProccedEventId = eventId;
      this.eventEmitter.emit('mail.sent', {
        eventId,
        guestId: guest.id,
        status: 'SUCCESS',
      });

      this.logger.log(`Mail sucessfully sent to ${guest.email}`);
    } catch (err) {
      this.logger.error(`Failed to send mail to ${guest.email}`, err.stack);
      this.eventEmitter.emit('mail.sent', {
        eventId,
        guestId: guest.id,
        status: 'ERROR',
        reason: err.message,
      });
      throw error;
    }
  }
}
