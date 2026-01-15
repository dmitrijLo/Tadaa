import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtDevGuard } from '../auth/guards/jwt-dev.guard';
import type { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user?: { id: number };
}

@Controller('events')
@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtDevGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event.' })
  @ApiCreatedResponse({ description: 'Event has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  @ApiUnauthorizedResponse({ description: 'User not logged in.' })
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req: RequestWithUser,
  ) {
    const hostId = req.user?.id;
    if (!hostId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.eventsService.create(createEventDto, hostId.toString());
  }

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
