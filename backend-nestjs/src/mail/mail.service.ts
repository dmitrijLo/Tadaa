import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Event } from 'src/events/entities/event.entity';
import { Guest } from 'src/guests/entities/guest.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  async sendGuestInvitation(guest: Guest, event: Event) {
    const { invitationLink, trackingPixelUrl } = this.generetaUrls(guest.id);

    return this.mailerService.sendMail({
      to: guest.email,
      subject: `Einladung zu ${event.name}`,
      template: './invitation',
      context: {
        link: invitationLink,
        logoUrl: trackingPixelUrl,
        hostName: event.host,
        guestName: guest.name,
        eventName: event.name,
        eventDescription: event.description,
        eventDate: this.formatDate(event.eventDate),
        budget: `${event.budget} ${event.currency}`,
        deadline: event.draftDate,
        eventMode: event.eventMode,
        eventRule: event.drawRule,
      },
    });
  }

  async sendAssignmentMail(guest: Guest, event: Event, assignmentData: any) {
    const { invitationLink, trackingPixelUrl } = this.generetaUrls(guest.id);

    return this.mailerService.sendMail({
      to: guest.email,
      subject: `🤫 Dein Wichtel-Ziel für ${event.name}`,
      template: './assignment',
      context: {
        link: invitationLink,
        logoUrl: trackingPixelUrl,
        hostName: event.host,
        guestName: guest.name,
        eventName: event.name,
        eventDescription: event.description,
        eventDate: this.formatDate(event.eventDate),
        budget: `${event.budget} ${event.currency}`,
        eventMode: event.eventMode,
        eventRule: event.drawRule,
        assignment: {
          recipientName: guest.assignedRecipient,
        },
      },
    });
  }

  /*
   * HELPER
   */

  private generetaUrls(guestId: string) {
    const baseUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const backendUrl = this.configService.get('BACKEND_URL') || 'http://localhost:3001';
    return {
      invitationLink: `${baseUrl}/guests/${guestId}`,
      trackingPixelUrl: `${backendUrl}/mail/logo.png?guestId=${guestId}`,
    };
  }
}
