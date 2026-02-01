import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssignmentContext, MailEventData, MailGuestData } from './dto/mail.dto';

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

  async sendGuestInvitation(guest: MailGuestData, event: MailEventData) {
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

  async sendAssignmentMail(guest: MailGuestData, event: MailEventData, context: AssignmentContext) {
    const { invitationLink, trackingPixelUrl } = this.generetaUrls(guest.id);
    let recipientText = context.recipientName;
    if (!recipientText && context.pickOrder) {
      recipientText = `Du bist Nummer ${context.pickOrder} in der Reihenfolge!`;
    }

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
          recipientName: recipientText,
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
