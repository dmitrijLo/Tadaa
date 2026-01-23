import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Guest } from 'src/guests/entities/guest.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendGuestInvitation(guest: Guest, eventName: string) {
    const baseUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const backendUrl = this.configService.get('BACKEND_URL') || 'http://localhost:3001';
    const { id: guestId, email, name } = guest;
    const invitationLink = `${baseUrl}/guests/${guestId}`;
    const hasOpenedLogoUrl = `${backendUrl}/mail/logo.png?guestId=${guest.id}`;

    return this.mailerService.sendMail({
      to: email,
      subject: `Einladung zu ${eventName}`,
      template: './invitation',
      context: {
        name,
        eventName,
        link: invitationLink,
        logoUrl: hasOpenedLogoUrl,
      },
    });
  }
}
