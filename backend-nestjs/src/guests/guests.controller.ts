import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GuestsService } from './guests.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  // get guest by invite token (public - UUID acts as access token)
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Get('event-info/:eventId')
  getEventInfo(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.guestsService.getEventInfo(eventId);
  }

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

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('register/:eventId')
  registerForEvent(@Param('eventId', ParseUUIDPipe) eventId: string, @Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.registerForEvent(eventId, createGuestDto);
  }
}
