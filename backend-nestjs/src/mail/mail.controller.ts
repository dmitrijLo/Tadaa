import { Controller, Get, Logger, Post, Query, Res } from '@nestjs/common';
import { type Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { InviteStatus } from 'src/enums';
import { GuestsService } from 'src/guests/guests.service';

@Controller('mail')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly guestsService: GuestsService) {}

  @Get('logo.png')
  async serveLogoAndMarkOpened(@Query('guestId') guestId: string, @Res() res: Response) {
    if (guestId) {
      this.guestsService.markInviteStatusAs(guestId, InviteStatus.OPENED).catch((err) => {
        this.logger.error(`Failed to track open for guest ${guestId}`, err);
      });
    }

    const logoPath = join(process.cwd(), 'assets', 'logo.png');
    if (!existsSync(logoPath)) {
      this.logger.error(`logo not found: ${logoPath}`);
      res.status(404).send('Logo not found');
      return;
    }

    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });

    const fileStream = createReadStream(logoPath);
    fileStream.pipe(res);
  }
}
