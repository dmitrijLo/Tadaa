import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';
import { InviteStatus } from '../enums';

import { randomUUID } from 'crypto';
import { Event } from 'src/events/entities/event.entity';
import { InterestOption } from '../interests/entities/interest-option.entity';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest) private guestRepository: Repository<Guest>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(InterestOption)
    private interestOptionRepository: Repository<InterestOption>,
  ) {}

  // create a new guest
  // TODO uuids should be generted by pg, also make inveite token and guest id same
  async create(
    eventId: string,
    userId: string,
    createGuestDto: CreateGuestDto,
  ): Promise<Guest> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found!');
    if (event.hostId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to add guests to this event!',
      );
    }

    const { email } = createGuestDto;
    const existingGuest = await this.guestRepository.findOne({
      where: { email, eventId },
    });

    if (existingGuest) {
      throw new ConflictException(
        'Guest with this email already exists for this event.',
      );
    }

    const newGuest = this.guestRepository.create({
      ...createGuestDto,
      eventId: eventId,
      inviteToken: randomUUID(),
      inviteStatus: InviteStatus.INVITED,
    });

    try {
      return await this.guestRepository.save(newGuest);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  // get guestpage by token
  async findOneByToken(token: string) {
    const guest = await this.guestRepository.findOne({
      where: { inviteToken: token },
      relations: ['event', 'interests'],
    });
    return guest;
  }

  async findAllGuestsByEventId(eventId: string): Promise<Guest[]> {
    const guests = await this.guestRepository.findBy({ eventId });
    return guests;
  }

  // INTEEREST SERVICES
  //add interest to guest
  async addInterestToGuest(
    guestId: string,
    interestId: string,
  ): Promise<Guest> {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId },
      relations: ['interests'],
    });
    if (!guest) {
      throw new NotFoundException(`Guest with ID ${guestId} not found`);
    }

    const interest = await this.interestOptionRepository.findOne({
      where: { id: interestId },
    });
    if (!interest) {
      throw new NotFoundException(`Interest with ID ${interestId} not found`);
    }

    if (!guest.interests.some((interest) => interest.id === interestId)) {
      guest.interests.push(interest);
      await this.guestRepository.save(guest);
    }

    return guest;
  }

  // remove interst from guest
  async removeInterestFromGuest(
    guestId: string,
    interestId: string,
  ): Promise<Guest> {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId },
      relations: ['interests'],
    });
    if (!guest) {
      throw new NotFoundException(`Guest with ID ${guestId} not found`);
    }

    const interestExists = guest.interests.some(
      (interest) => interest.id === interestId,
    );
    if (!interestExists) {
      throw new NotFoundException(
        `Interest with ID ${interestId} not found in guest's interests`,
      );
    }

    guest.interests = guest.interests.filter(
      (interest) => interest.id !== interestId,
    );
    await this.guestRepository.save(guest);
    return guest;
  }
}
