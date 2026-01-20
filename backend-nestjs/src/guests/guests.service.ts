import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';
import { InviteStatus } from '../enums';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  // create a new guest
  // TODO uuids should be generted by pg, also make inveite token and guest id same
  async create(eventId: string, userId: string, createGuestDto: CreateGuestDto): Promise<Guest> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found!');
    if (event.hostId !== userId) {
      throw new ForbiddenException('You are not allowed to add guests to this event!');
    }

    const { email } = createGuestDto;
    const existingGuest = await this.guestRepository.findOne({
      where: { email, eventId },
    });

    if (existingGuest) {
      throw new ConflictException('Guest with this email already exists for this event.');
    }

    const newGuest = this.guestRepository.create({
      ...createGuestDto,
      eventId: eventId,
      inviteStatus: InviteStatus.INVITED,
    });

    try {
      return await this.guestRepository.save(newGuest);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  // get guestpage by token
  async findOneById(guestId: string) {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId },
      relations: ['event', 'interests', 'no_interests'],
    });
    if (!guest) {
      return null;
    }

    const interests = (guest.interests || []).map((interest) => interest.id);
    const noInterest = (guest.no_interests || []).map((interest) => interest.id);

    return {
      ...guest,
      interests,
      noInterest,
    };
  }

  async findAllGuestsByEventId(eventId: string): Promise<Guest[]> {
    const guests = await this.guestRepository.findBy({ eventId });
    return guests;
  }

  async getAssignment(guestId: string): Promise<Guest> {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId },
      relations: ['event', 'assignedRecipient', 'assignedRecipient.interests', 'assignedRecipient.no_interests'],
    });

    if (!guest || !guest.assignedRecipient) {
      throw new NotFoundException('Assignment not found for this guest.');
    }
    return guest;
  }
}
