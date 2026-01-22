import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { GuestsService } from './guests.service';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  // get guest by invite token
  @Get(':guestId')
  findByToken(@Param('guestId', ParseUUIDPipe) guestId: string) {
    return this.guestsService.findOneById(guestId);
  }

  @Patch(':id/acceptinvitation')
  updateGuestStatus(
    @Param('id', ParseUUIDPipe) guestId: string,
    @Body() updateData: { accept: boolean; declineMessage: string },
  ) {
    return this.guestsService.updateGuestStatus(guestId, updateData.accept, updateData.declineMessage);
  }
}
