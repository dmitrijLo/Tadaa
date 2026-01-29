import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  // get guest by invite token (public - UUID acts as access token)
  @Public()
  @Get(':guestId')
  findByToken(@Param('guestId', ParseUUIDPipe) guestId: string) {
    return this.guestsService.findOneById(guestId);
  }

  // guest accepts or declines invitation (public - UUID acts as access token)
  @Public()
  @Patch(':id/acceptinvitation')
  updateGuestStatus(
    @Param('id', ParseUUIDPipe) guestId: string,
    @Body() updateData: { accept: boolean; declineMessage: string },
  ) {
    return this.guestsService.updateGuestStatus(guestId, updateData.accept, updateData.declineMessage);
  }
}
