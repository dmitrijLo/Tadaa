import { Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { JwtDevGuard } from 'src/auth/guards/jwt-dev.guard';
import { EventOwnerGuard } from 'src/events/guards/event-owner.guard';

@Controller('events')
@UseGuards(JwtDevGuard)
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post(':eventId/draw')
  @UseGuards(EventOwnerGuard)
  async draw(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.assignmentService.draw(eventId);
  }
}
