import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { Event } from 'src/events/entities/event.entity';

interface RequestWithUserAndEvent {
  user: { id: string; email: string };
  event?: Event;
}

export const EventFromRequest = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<RequestWithUserAndEvent>();
  if (!request.event)
    throw new InternalServerErrorException('Event not found in request. Did you forgot @UseGuards(EventOwnerGuard)?');

  return request.event;
});
