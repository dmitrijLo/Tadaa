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

@Injectable()
export class EventsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventsService.name);
  // hier unser default dev = host
  private readonly HOST_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  private readonly EVENT_ID = 'e77b9a3f-911d-41d4-807b-8f4e315c6f31';

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly guestService: GuestsService,
    private readonly usersService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedDevEvent();
  }

  private async seedDevEvent() {
    if (process.env.JWT_DEV_MODE !== 'true') return;

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

    const savedEvent = await this.eventRepository.save(event);

    // get host user to extract email and name
    const hostUser = await this.usersService.findbyId(hostId);
    if (hostUser && hostUser.email) {
      const hostGuest = await this.guestService.createHostGuest({
        email: hostUser.email,
        name: hostUser.name || 'Host',
        eventId: savedEvent.id,
      });
      this.logger.log(`Host added as guest: ${hostGuest.id}`);
    }

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
    await this.findOne(id);

    await this.eventRepository.update(id, updateEventDto);
    return (await this.eventRepository.findOne({ where: { id } })) as Event;
  }

  async remove(event: Event): Promise<void> {
    await this.eventRepository.remove(event);
  }

  async markStatusAs(eventId: string, nextStatus: EventStatus): Promise<void> {
    await this.eventRepository.update(eventId, { status: nextStatus });
  }

  /*
   * Helper Methods
   */
  async verifyEventExists(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException(`Event with ID "${eventId}" not found`);

    return event;
  }

  async verifyEventOwner(eventId: string, userId: string): Promise<Event> {
    const event = await this.verifyEventExists(eventId);
    if (event.hostId !== userId) throw new ForbiddenException('You do not have permission to modify this event.');

    return event;
  }
}
