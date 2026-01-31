import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Sse,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
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
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DevBypass } from '../auth/decorators/dev-bypass.decorator';
import { GuestsService } from 'src/guests/guests.service';
import { CreateGuestDto } from 'src/guests/dto/create-guest.dto';
import { UserFromRequest } from 'src/decorators/user-payload.decorator';
import { GuestResponseDto, GuestsInvitationStats } from 'src/guests/dto/guest-response.dto';
import { EventOwnerGuard } from './guards/event-owner.guard';
import { EventFromRequest } from 'src/decorators/event-payload.decorator';
import { Event } from './entities/event.entity';
import { UpdateGuestDto } from 'src/guests/dto/update-guest.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventStatus } from 'src/enums';
import { BaseUserDto } from 'src/users/dto/create-user.dto';
import { PaginatedEventsResponse, PaginationQueryDto } from './dto/event-response.dto';

interface MailSentEvent {
  eventId: string;
  status: 'SUCCESS' | 'ERROR' | 'DONE';
  guestId: string;
  reason?: string;
}

@Controller('events')
@ApiTags('Events')
@ApiBearerAuth()
@DevBypass()
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly guestsService: GuestsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get(':eventId/stats')
  @UseGuards(EventOwnerGuard)
  @ApiOperation({ summary: 'Receive event related statistics.' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: GuestsInvitationStats, description: 'Receive some statistics on specific event.' })
  @ApiUnauthorizedResponse({ description: 'User not logged in.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiForbiddenResponse({ description: 'You are not allowed to query this event.' })
  @ApiNotFoundResponse({ description: 'Event was not found.' })
  getGuestsStats(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.guestsService.getConfirmationStats(eventId);
  }

  @Get(':eventId/guests')
  @UseGuards(EventOwnerGuard)
  @ApiOperation({ summary: 'Receive all guest of specific event.' })
  @ApiOkResponse({ type: [GuestResponseDto], description: 'Receive a list of guests.' })
  getGuests(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.guestsService.findAllGuestsByEventId(eventId);
  }

  @Delete(':eventId/guests/:guestId')
  @UseGuards(EventOwnerGuard)
  @ApiOperation({ summary: 'Remove guest from event.' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'guestId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Guest successfully removed.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Guest already invited.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Not event owner.' })
  @ApiResponse({ status: 404, description: 'Guest not found.' })
  removeGuest(@Param('guestId', ParseUUIDPipe) guestId: string, @EventFromRequest() event: Event) {
    return this.guestsService.removeGuest(event, guestId);
  }

  @Patch(':eventId/guests/:guestId')
  @UseGuards(EventOwnerGuard)
  @ApiOperation({ summary: 'Update guest details (Draft only).' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'guestId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Guest updated.', type: GuestResponseDto })
  @ApiResponse({ status: 400, description: 'Guest cannot be edited (not draft).' })
  updateGuest(
    @Param('guestId', ParseUUIDPipe) guestId: string,
    @EventFromRequest() event: Event,
    @Body() guestUpdate: UpdateGuestDto,
  ) {
    return this.guestsService.updateGuest(event, guestId, guestUpdate);
  }

  @Post(':eventId/guests')
  @UseGuards(EventOwnerGuard)
  @ApiOperation({ summary: 'Add a guest to an event.' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Guest successfully invited.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You are not the owner.' })
  @ApiResponse({ status: 409, description: 'Guest already invited.' })
  async addGuest(@EventFromRequest() event: Event, @Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(event, createGuestDto);
  }

  @Post(':eventId/guests/invite')
  @ApiOperation({ description: 'Send invitations to all draft guests.' })
  @ApiParam({ name: 'eventId', type: 'string', format: 'uuid' })
  @ApiResponse({})
  @UseGuards(EventOwnerGuard)
  async inviteGuests(@EventFromRequest() event: Event) {
    await this.eventsService.markStatusAs(event.id, EventStatus.INVITED);
    return this.guestsService.inviteGuests(event);
  }

  @Sse(':eventId/mail-stream')
  @UseGuards(EventOwnerGuard)
  mailStream(@Param('eventId') eventId: string): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'mail.sent').pipe(
      filter((payload: MailSentEvent) => payload.eventId === eventId),
      map((payload) => ({ data: payload }) as MessageEvent),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new event.' })
  @ApiCreatedResponse({ description: 'Event has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'User not logged in.' })
  createEvent(@Body() createEventDto: CreateEventDto, @UserFromRequest() user: { id: string }) {
    return this.eventsService.create(createEventDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events of an Event-Host (user).' })
  @ApiOkResponse({ type: PaginatedEventsResponse, description: 'Receive a list of events.' })
  @ApiUnauthorizedResponse({ description: 'User not logged in.' })
  @ApiBadRequestResponse({ description: 'Validation failed (e.g. invalid page or limit).' })
  getAllEventsWithPagination(@UserFromRequest() user: BaseUserDto, @Query() query: PaginationQueryDto) {
    const { limit, page } = query;
    return this.eventsService.findAllEventsByHost(user.id, limit, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':eventId')
  @UseGuards(EventOwnerGuard)
  @ApiOperation({ summary: 'Delete an event.' })
  @ApiNoContentResponse({ description: 'Event successfully deleted.' })
  @ApiUnauthorizedResponse({ description: 'User not logged in.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiForbiddenResponse({ description: 'You are not allowed to delete this event.' })
  @ApiNotFoundResponse({ description: 'Event was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@EventFromRequest() event: Event) {
    return this.eventsService.remove(event);
  }
}
