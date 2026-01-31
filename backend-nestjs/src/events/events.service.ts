import { ForbiddenException, Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { DrawRule, EventMode, EventStatus } from '../enums';
import { GuestsService } from 'src/guests/guests.service';
import { UsersService } from 'src/users/users.service';
import { EventResponseDto, PaginatedEventsResponse } from './dto/event-response.dto';
import { plainToInstance } from 'class-transformer';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventsService.name);
  // hier unser default dev = host
  private readonly HOST_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  private readonly EVENT_ID = 'e77b9a3f-911d-41d4-807b-8f4e315c6f31';

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    // private readonly guestService: GuestsService,
    // private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('mail-queue') private mailQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    await this.seedDevEvent();
  }

  private async seedDevEvent() {
    if (process.env.NODE_ENV === 'production') return;

    const eventExists = await this.eventRepository.findOneBy({ id: this.EVENT_ID });

    if (!eventExists) {
      this.logger.log('Seeding default Dev-Event...');

      const newEvent = this.eventRepository.create({
        id: this.EVENT_ID,
        hostId: this.HOST_ID,
        name: 'Secret Santa Party 2026',
        description: 'Das automatische Test-Event für die Entwicklung.',
        budget: 50,
        currency: 'EUR',
        eventMode: EventMode.CLASSIC,
        drawRule: DrawRule.CHAIN,
        status: EventStatus.CREATED,
      });

      try {
        await this.eventRepository.save(newEvent);
        this.logger.log(`Dev-Event created: ${this.EVENT_ID}`);
      } catch (err: unknown) {
        this.logger.error('Failed to seed event.', err);
      }
    } else {
      this.logger.debug('Dev-Event already exists.');
    }
  }

  async create(createEventDto: CreateEventDto, hostId: string): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      hostId,
      status: EventStatus.CREATED,
    });

    const savedEvent = await this.saveAndSchedule(event);

    // we emit an event and create the event host as guest for this event
    this.eventEmitter.emit('event.created', { event: savedEvent, hostId });

    return savedEvent;
  }

  async findAllEventsByHost(userId: string, limit: number, page: number): Promise<PaginatedEventsResponse> {
    const [events, total] = await this.eventRepository.findAndCount({
      where: { hostId: userId },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: plainToInstance(EventResponseDto, events, { excludeExtraneousValues: true }),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.findOne(id);
    const updatedEvent = this.eventRepository.merge(existingEvent, updateEventDto);
    return this.saveAndSchedule(updatedEvent);
  }

  async remove(event: Event): Promise<void> {
    await this.cleanupSchedules(event);
    await this.eventRepository.remove(event);
  }

  async markStatusAs(eventId: string, nextStatus: EventStatus): Promise<void> {
    await this.eventRepository.update(eventId, { status: nextStatus });
  }

  async saveAndSchedule(eventData: Partial<Event>) {
    const savedEvent = await this.eventRepository.save(eventData);
    await this.syncSchedules(savedEvent);
    return savedEvent;
  }

  private async syncSchedules(event: Event) {
    let hasChanges = false;

    /*
     * sync invitation schedule,
     * delete old, then schedule new
     */
    if (event.scheduledInviteJobId) {
      await this.removeJobSafely(event.scheduledInviteJobId);
      event.scheduledInviteJobId = null;
      hasChanges = true;
    }

    if (event.invitationDate) {
      const delay = this.calculateDelay(event.invitationDate);
      if (delay > 0) {
        const job = await this.mailQueue.add(
          'trigger-invites',
          { type: 'TRIGGER_INVITES', eventId: event.id },
          { delay, jobId: `invite-${event.id}-${Date.now()}` },
        );

        if (job && job.id) {
          event.scheduledInviteJobId = job.id;
          hasChanges = true;
          this.logger.log(`Scheduled Invitations for Event ${event.id} in ${Math.round(delay / 60000)} minutes`);
        }
      } else {
        this.logger.warn(`Invitation date is in the past. No auto-schedule created.`);
      }
    }

    /*
     * sync assignment schedule,
     * delete old, then schedule new
     */
    if (event.scheduledAssignJobId) {
      await this.removeJobSafely(event.scheduledAssignJobId);
      event.scheduledAssignJobId = null;
      hasChanges = true;
    }

    if (event.draftDate) {
      const delay = this.calculateDelay(event.draftDate);
      if (delay > 0) {
        const job = await this.mailQueue.add(
          'trigger-assignments',
          { type: 'TRIGGER_ASSIGNMENTS', eventId: event.id },
          { delay, jobId: `assign-${event.id}-${Date.now()}` },
        );

        if (job && job.id) {
          event.scheduledAssignJobId = job.id;
          hasChanges = true;
          this.logger.log(`Scheduled Assignments for Event ${event.id} in ${Math.round(delay / 60000)} minutes`);
        }
      } else {
        this.logger.warn(`Assignments date is in the past. No auto-schedule created.`);
      }
    }
    if (hasChanges) await this.eventRepository.save(event);
  }

  /*
   * Helper Methods
   */
  async verifyEventExists(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: ['host'] });
    if (!event) throw new NotFoundException(`Event with ID "${eventId}" not found`);

    return event;
  }

  async verifyEventOwner(eventId: string, userId: string): Promise<Event> {
    const event = await this.verifyEventExists(eventId);
    if (event.hostId !== userId) throw new ForbiddenException('You do not have permission to modify this event.');

    return event;
  }

  async cleanupSchedules(event: Event) {
    if (event.scheduledInviteJobId) await this.removeJobSafely(event.scheduledInviteJobId);
    if (event.scheduledAssignJobId) await this.removeJobSafely(event.scheduledAssignJobId);
  }

  private async removeJobSafely(jobId: string) {
    try {
      const job = await this.mailQueue.getJob(jobId);
      if (job) await job.remove();
    } catch (err) {
      this.logger.warn(`Could not remove job ${jobId}: ${err.message}`);
    }
  }

  private calculateDelay(date: Date | string): number {
    const target = new Date(date);

    if (isNaN(target.getTime())) {
      this.logger.error(`CRITICAL: Scheduling failed. Invalid date format found: ${date}`);
    }

    return target.getTime() - Date.now();
  }
}
