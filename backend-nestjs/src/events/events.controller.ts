import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtDevGuard } from '../auth/guards/jwt-dev.guard';
import { GuestsService } from 'src/guests/guests.service';
import { CreateGuestDto } from 'src/guests/dto/create-guest.dto';
import { UserFromRequest } from 'src/decorators/user-payload.decorator';
import { GuestResponseDto } from 'src/guests/dto/guest-response.dto';
import { EventOwnerGuard } from './guards/event-owner.guard';
import { EventFromRequest } from 'src/decorators/event-payload.decorator';

@ApiTags('Events')
@Controller('events')
@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtDevGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly guestsService: GuestsService,
  ) {}

  @Get(':eventId/guests')
  @ApiOperation({ summary: 'Receive all guest of specific event.' })
  @ApiOkResponse({ type: [GuestResponseDto], description: 'Receive a list of guests.' })
  async getGuests(@Param('eventId', ParseUUIDPipe) eventId: string, @UserFromRequest() user: { id: string }) {
    return this.eventsService.findAllEventGuests(eventId, user.id);
  }

  @Delete(':eventId/guests/:guestId') // :eventId bleibt in der Route!
  @UseGuards(EventOwnerGuard)
  // Swagger Updates:
  @ApiResponse({ status: 204, description: 'Guest successfully removed.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Guest already invited.' }) // Korrigiert
  @ApiResponse({ status: 403, description: 'Forbidden. Not event owner.' })
  @ApiResponse({ status: 404, description: 'Guest not found.' })
  removeGuest(
    // eventId hier gelöscht, da wir es eh nicht nutzen
    @Param('guestId', ParseUUIDPipe) guestId: string,
    @EventFromRequest() event: Event,
  ) {
    return this.guestsService.removeGuest(event, guestId);
  }

  @Post(':eventId/guests')
  @ApiOperation({ summary: 'Add a guest to an event.' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Guest successfully invited.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You are not the owner.',
  })
  @ApiResponse({ status: 409, description: 'Guest already invited.' })
  async addGuest(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() createGuestDto: CreateGuestDto,
    @UserFromRequest() user: { id: string },
  ) {
    return this.guestsService.create(eventId, user.id, createGuestDto);
  }

  // get all guests for event with status:
  // @Get(':id/readiness')
  // findAllGuests(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.eventsService.findAllEventGuests(id);
  // }

  @Post()
  @ApiOperation({ summary: 'Create a new event.' })
  @ApiCreatedResponse({ description: 'Event has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'User not logged in.' })
  createEvent(@Body() createEventDto: CreateEventDto, @UserFromRequest() user: { id: string }) {
    return this.eventsService.create(createEventDto, user.id);
  }

  // generic routes
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
