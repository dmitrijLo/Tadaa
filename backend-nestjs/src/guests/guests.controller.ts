import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('event-info/:eventId')
  getEventInfo(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.guestsService.getEventInfo(eventId);
  }

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

  @Post('register/:eventId')
  registerForEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() createGuestDto: CreateGuestDto,
  ) {
    return this.guestsService.registerForEvent(eventId, createGuestDto);
  }
}
