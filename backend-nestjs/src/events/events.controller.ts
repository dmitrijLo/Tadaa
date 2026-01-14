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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtDevGuard } from '../auth/guards/jwt-dev.guard';

@Controller('events')
@UseGuards(JwtDevGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // get all guests for event with status:
  @Get(':id/readiness')
  findAllGuests(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findAllEventGuests(id);
  }

  // generic routes
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
