import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { EventsService } from '../events.service';
import { Request } from 'express';
import { Event } from '../entities/event.entity';

interface RequestWithUserAndEvent extends Request {
  user: { id: string; email: string };
  event?: Event;
}

@Injectable()
export class EventOwnerGuard implements CanActivate {
  constructor(private readonly eventService: EventsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUserAndEvent>();
    const user = request.user;
    const eventId = request.params.eventId as string;
    console.log('PARAMS:', request.params); // Zeigt { eventId: '...' }
    console.log('USER:', request.user); // Zeigt User (weil AuthGuard schon lief)
    console.log('EVENT:', request.event);
    if (!user) return false;
    if (!eventId) throw new BadRequestException('Event ID missing');

    const event = await this.eventService.verifyEventOwner(eventId, user.id);
    console.log('EVENT AFTER:', request.event);
    request.event = event;

    return true;
  }
}
