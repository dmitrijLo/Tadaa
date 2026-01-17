import { Controller, Get, Param, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { GuestsService } from './guests.service';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  // get guest by invite token
  @Get(':guestId')
  async findByToken(@Param('guestId', ParseUUIDPipe) guestId: string) {
    const guest = await this.guestsService.findOneByToken(guestId);
    if (!guest) {
      throw new NotFoundException('Guest not found');
    }
    return guest;
  }
}
