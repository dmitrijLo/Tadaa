import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';
import { InviteStatus } from '../enums';
import { Event } from '../events/entities/event.entity';
import { GuestResponseDto } from './dto/guest-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateGuestDto } from './dto/update-guest.dto';

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
      inviteStatus: InviteStatus.DRAFT as InviteStatus,
    });

    const savedGuest = await this.guestRepository.save(newGuest);
    return plainToInstance(GuestResponseDto, savedGuest, { excludeExtraneousValues: true });
  }

  async removeGuest(event: Event, guestId: string) {
    const guest = await this.guestRepository.findOneBy({ id: guestId, eventId: event.id });

    this.verifyGuestIsEditable(guest);

    await this.guestRepository.remove(guest);
  }

  async updateGuest(event: Event, guestId: string, guestUpdate: UpdateGuestDto): Promise<GuestResponseDto> {
    const guest = await this.guestRepository.findOneBy({ id: guestId, eventId: event.id });
    this.verifyGuestIsEditable(guest);
    Object.assign(guest, guestUpdate);
    const savedGuest = await this.guestRepository.save(guest);

    return plainToInstance(GuestResponseDto, savedGuest, { excludeExtraneousValues: true });
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

    return {
      ...guest,
      interests: guest.interests || [],
      noInterest: guest.no_interests || [],
    };
  }

  async findAllGuestsByEventId(eventId: string): Promise<GuestResponseDto[]> {
    const guests = await this.guestRepository.findBy({ eventId });
    return plainToInstance(GuestResponseDto, guests);
  }

  /*
   * Helper
   */

  verifyGuestIsEditable(guest: Guest | null): asserts guest is Guest {
    if (!guest) throw new NotFoundException('Guest not found for this event.');

    if (guest.inviteStatus !== InviteStatus.DRAFT)
      throw new BadRequestException('Cannot update or remove guest. Invitation already sent.');
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

  // create host as guest
  async createHostGuest(data: { email: string; name: string; eventId: string }): Promise<Guest> {
    const { email, name, eventId } = data;

    const existingGuest = await this.guestRepository.findOne({
      where: { email, eventId },
    });

    if (existingGuest) {
      return existingGuest;
    }

    const hostGuest = this.guestRepository.create({
      email,
      name,
      eventId,
      inviteStatus: InviteStatus.ACCEPTED,
    });

    return await this.guestRepository.save(hostGuest);
  }
}
