import { Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { DrawRule, EventMode, EventStatus } from '../enums';

@Injectable()
export class EventsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventsService.name);
  // hier unser default dev = host
  private readonly HOST_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  private readonly EVENT_ID = 'e77b9a3f-911d-41d4-807b-8f4e315c6f31';

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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
        currency: 'euro',
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

    return await this.eventRepository.save(event);
  }

  async findAllEventGuests(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        guests: true,
      },
    });

    return event?.guests ?? [];
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find();
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

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }
}
