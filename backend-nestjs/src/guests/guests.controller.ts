import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { GuestsService } from './guests.service';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  // get guest by invite token
  @Get(':guestId')
  findByToken(@Param('guestId', ParseUUIDPipe) guestId: string) {
    return this.guestsService.findOneById(guestId);
  }
}
