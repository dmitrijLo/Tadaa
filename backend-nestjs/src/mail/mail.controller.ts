import { Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { type Response } from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Public } from 'src/auth/decorators/public.decorator';
import { InviteStatus } from 'src/enums';
import { GuestsService } from 'src/guests/guests.service';

@Controller('mail')
@Public()
export class MailController {
  private readonly logger = new Logger(MailController.name);
  private readonly logoBuffer: Buffer;

  constructor(private readonly guestsService: GuestsService) {
    const logoPath = join(process.cwd(), 'assets', 'logo.png');
    if (!existsSync(logoPath)) {
      this.logger.error(`logo not found: ${logoPath}`);
      return;
    }

    try {
      this.logoBuffer = readFileSync(logoPath);
      this.logger.log(`Logo loaded into memory (${this.logoBuffer.length}) bytes`);
    } catch (err) {
      this.logger.error(`Failed to load logo file`, err);
    }
  }

  @Get('logo.png')
  serveLogoAndMarkOpened(@Query('guestId') guestId: string, @Res() res: Response) {
    if (guestId) {
      this.guestsService.markInviteStatusAs(guestId, InviteStatus.OPENED).catch((err) => {
        this.logger.error(`Failed to track open for guest ${guestId}`, err);
      });
    }

    if (!this.logoBuffer) {
      res.status(404).send('Logo not available');
      return;
    }

    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });

    res.send(this.logoBuffer);
  }
}
