import { Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { DevAwareAuthGuard } from 'src/auth/guards/jwt-dev.guard';
import { DevBypass } from 'src/auth/decorators/dev-bypass.decorator';
import { EventOwnerGuard } from 'src/events/guards/event-owner.guard';

@Controller('events')
@UseGuards(DevAwareAuthGuard)
@DevBypass()
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post(':eventId/draw')
  @UseGuards(EventOwnerGuard)
  async draw(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.assignmentService.draw(eventId);
  }
}
