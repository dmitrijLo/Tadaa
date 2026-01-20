import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';
import { InviteStatus } from '../enums';
import { Event } from '../events/entities/event.entity';
import { GuestResponseDto } from './dto/guest-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  // create a new guest
  async create(event: Event, createGuestDto: CreateGuestDto): Promise<GuestResponseDto> {
    const { email } = createGuestDto;
    const existingGuest = await this.guestRepository.findOne({
      where: { email, eventId: event.id },
    });

    if (existingGuest) {
      throw new ConflictException('Guest with this email already exists for this event.');
    }

    const newGuest = this.guestRepository.create({
      ...createGuestDto,
      eventId: event.id,
      inviteStatus: InviteStatus.DRAFT,
    });

    const savedGuest = await this.guestRepository.save(newGuest);
    return plainToInstance(GuestResponseDto, savedGuest, { excludeExtraneousValues: true });
  }

  async removeGuest(event: Event, guestId: string) {
    const guest = await this.guestRepository.findOneBy({ id: guestId, eventId: event.id });

    if (!guest) throw new NotFoundException('Guest not found for this event.');

    if (guest.inviteStatus !== InviteStatus.DRAFT)
      throw new BadRequestException('Cannot remove guest. Invitation already sent.');

    await this.guestRepository.remove(guest);
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

  async findAllGuestsByEventId(eventId: string): Promise<GuestResponseDto[]> {
    const guests = await this.guestRepository.findBy({ eventId });
    return plainToInstance(GuestResponseDto, guests);
  }
}
