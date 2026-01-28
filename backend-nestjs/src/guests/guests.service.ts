import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { InviteStatus } from '../enums';
import { Event } from '../events/entities/event.entity';
import { GuestResponseDto, GuestsInvitationStats } from './dto/guest-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class GuestsService {
  private readonly INVITE_STATUS_SEQUENCE = {
    [InviteStatus.DRAFT]: 0,
    [InviteStatus.INVITED]: 1,
    [InviteStatus.OPENED]: 2,
    [InviteStatus.ACCEPTED]: 3,
    [InviteStatus.DENIED]: 3,
  };

  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectQueue('mail-queue') private readonly mailQueue: Queue,
  ) {}

  // register guest for event (public endpoint)
  async registerForEvent(eventId: string, createGuestDto: CreateGuestDto): Promise<GuestResponseDto> {
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`);
    }
    return this.create(event, createGuestDto);
  }

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

  async inviteGuests(event: Event) {
    const guests = await this.findAllInvitableGuests(event.id);
    if (guests.length === 0) return { message: 'Keine Gäste zum Einladen gefunden.', queueCount: 0 };

    const jobs = guests.map((guest) => ({
      name: 'send-invitation',
      data: {
        guest,
        eventName: event.name,
        eventId: event.id,
      },
    }));
    await this.mailQueue.addBulk(jobs);

    return { message: 'Einladungen werden im Hintergrund verarbeitet.', queueCount: guests.length };
  }

  async getConfirmationStats(eventId: string): Promise<GuestsInvitationStats> {
    const stats: GuestsInvitationStats = { totalGuests: 0, accepted: 0, denied: 0, open: 0 };
    const rawResults: { status: string; count: string }[] = await this.guestRepository
      .createQueryBuilder('guest')
      .select('guest.inviteStatus', 'status')
      .addSelect('COUNT(guest.id)', 'count')
      .where('guest.eventId = :eventId', { eventId })
      .groupBy('guest.inviteStatus')
      .getRawMany();

    for (const r of rawResults) {
      const count = parseInt(r.count, 10);
      stats.totalGuests += count;
      r.status === InviteStatus.ACCEPTED
        ? (stats.accepted += count)
        : r.status === InviteStatus.DENIED
          ? (stats.denied += count)
          : (stats.open += count);
    }

    return stats;
  }

  // get guestpage by token
  async findOneById(guestId: string) {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId },
      relations: [
        'event',
        'interests',
        'no_interests',
        'assignedRecipient',
        'assignedRecipient.interests',
        'assignedRecipient.no_interests',
      ],
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

  async updateGuestStatus(guestId: string, accept: boolean, declineMessage: string): Promise<Guest> {
    const guest = await this.guestRepository.findOneBy({ id: guestId });
    if (!guest) {
      throw new NotFoundException('Guest not found.');
    }
    guest.inviteStatus = accept ? InviteStatus.ACCEPTED : InviteStatus.DENIED;
    guest.declineMessage = declineMessage;

    return await this.guestRepository.save(guest);
  }

  async findAllGuestsByEventId(eventId: string): Promise<GuestResponseDto[]> {
    const guests = await this.guestRepository.findBy({ eventId });
    return plainToInstance(GuestResponseDto, guests);
  }

  findAllInvitableGuests(eventId: string): Promise<Guest[]> {
    return this.guestRepository.find({ where: { eventId, inviteStatus: InviteStatus.DRAFT } });
  }

  async markInviteStatusAs(guestId: string, nextInviteStatus: InviteStatus) {
    const guest = await this.guestRepository.findOne({ where: { id: guestId }, select: ['id', 'inviteStatus'] });
    // nothing to update here
    if (!guest) return;
    if (nextInviteStatus === guest.inviteStatus) return;
    // eventHost wants (and can) reset inviteStatus
    if (nextInviteStatus === InviteStatus.DRAFT) {
      await this.guestRepository.update(guestId, { inviteStatus: nextInviteStatus });
      return;
    }

    const prevRank = this.INVITE_STATUS_SEQUENCE[guest.inviteStatus];
    const nextRank = this.INVITE_STATUS_SEQUENCE[nextInviteStatus];
    // draft -> invited -> opened -> accepted <-> denied
    if (nextRank >= prevRank) {
      await this.guestRepository.update(guestId, { inviteStatus: nextInviteStatus });
    }
  }

  /*
   * Helper
   */

  verifyGuestIsEditable(guest: Guest | null): asserts guest is Guest {
    if (!guest) throw new NotFoundException('Guest not found for this event.');

    if (guest.inviteStatus !== InviteStatus.DRAFT)
      throw new BadRequestException('Cannot update or remove guest. Invitation already sent.');
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
