import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { createQueryBuilder, EntityManager, Repository } from 'typeorm';
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

  // get public event info (only name)
  async getEventInfo(eventId: string): Promise<{ name: string }> {
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return { name: event.name };
  }

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
    if (!guest) throw new NotFoundException('Guest not found for this event.');

    if (this.isContentUpdate(guestUpdate)) this.verifyGuestIsEditable(guest);

    // Einfaches Update (kein Drag&Drop) -> Sofort speichern
    if (guestUpdate.orderIndex === undefined && guestUpdate.parentId === undefined) {
      Object.assign(guest, guestUpdate);

      return plainToInstance(GuestResponseDto, await this.guestRepository.save(guest), {
        excludeExtraneousValues: true,
      });
    }

    // Update durch Drag&Drop, Transaktion sorgt dafür, dass nur in die DB geschrieben wird
    // wenn alle aktionen erfolgreich sind.
    return await this.guestRepository.manager.transaction(async (entityManager) => {
      await this.reorderGuests(entityManager, event.id, guest, guestUpdate);
      const { orderIndex, parentId, ...simpleUpdates } = guestUpdate;
      Object.assign(guest, simpleUpdates);

      return plainToInstance(GuestResponseDto, await entityManager.save(guest), { excludeExtraneousValues: true });
    });
  }

  /**
   * Organisiert die Reihenfolge der Gäste
   */
  private async reorderGuests(manager: EntityManager, eventId: string, guest: Guest, dto: UpdateGuestDto) {
    // Gast wird zum Kind
    if (dto.parentId) {
      // Lücke schließen, falls es voher Root war
      if (guest.parentId === null && guest.orderIndex !== null) {
        await this.shiftGuests(manager, eventId, guest.orderIndex, null, -1);
      }
      guest.parentId = dto.parentId;
      guest.orderIndex = null;
    } // Gast wird verschoben
    else if (typeof dto.orderIndex === 'number') {
      await this.moveGuestInRootList(manager, eventId, guest, dto.orderIndex);
      guest.parentId = null;
      guest.orderIndex = dto.orderIndex;
    }
  }
  /**
   * Berechnet wie viel Platz gemacht werden muss
   */
  private async moveGuestInRootList(manager: EntityManager, eventId: string, guest: Guest, newIndex: number) {
    const oldIndex = guest.orderIndex;
    // War vorher Kind, wird jetztt Root
    if (oldIndex === null) {
      await this.shiftGuests(manager, eventId, newIndex, null, +1);
      return;
    }

    //Verschieben innerhalb der Liste
    if (oldIndex < newIndex) {
      // Bewegung nach unten z.b. 1->2
      await this.shiftGuests(manager, eventId, oldIndex + 1, newIndex, -1);
    } else if (oldIndex > newIndex) {
      // Bewegung nach oben z.b. 3->1
      await this.shiftGuests(manager, eventId, newIndex, oldIndex - 1, 1);
    }
  }

  /**
   * Verschiebt die Indizes der Gäster
   * min: Start des Bereichs (inklusive)
   * max: Ende des Bereichs (inklusive oder null)
   * delta_ Änderung (+1 oder -1)
   */
  private async shiftGuests(manager: EntityManager, eventId: string, min: number, max: number | null, delta: number) {
    const query = manager
      .createQueryBuilder()
      .update(Guest)
      .set({ orderIndex: () => `order_index + (${delta})` })
      .where('eventId = :eventId', { eventId })
      .andWhere('parentId IS NULL');

    if (max !== null) {
      // Bereichs Update z.B. Index 2 bis 5
      query.andWhere('orderIndex >= :min AND orderIndex <= :max', { min, max });
    } else {
      // Open-End Update z.B alles ab Index 2
      query.andWhere('orderIndex >= :min', { min });
    }

    await query.execute();
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
    const rawResults: { status: InviteStatus; count: string }[] = await this.guestRepository
      .createQueryBuilder('guest')
      .select('guest.inviteStatus', 'status')
      .addSelect('COUNT(guest.id)', 'count')
      .where('guest.eventId = :eventId', { eventId })
      .groupBy('guest.inviteStatus')
      .getRawMany();

    for (const r of rawResults) {
      const count = parseInt(r.count, 10);
      stats.totalGuests += count;
      if (r.status === InviteStatus.ACCEPTED) {
        stats.accepted += count;
      } else if (r.status === InviteStatus.DENIED) {
        stats.denied += count;
      } else {
        stats.open += count;
      }
    }

    return stats;
  }

  // get guestpage by token
  async findOneById(guestId: string) {
    const guest = await this.guestRepository.findOne({
      where: { id: guestId },
      relations: [
        'event',
        'event.guests',
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
    if (!guest) throw new NotFoundException('Guest not found for this event.');

    // nothing to update here
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
      await this.guestRepository.update(
        { id: guestId, inviteStatus: guest.inviteStatus },
        { inviteStatus: nextInviteStatus },
      );
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

  isContentUpdate(dto: UpdateGuestDto) {
    return (
      dto.name !== undefined ||
      dto.email !== undefined ||
      dto.noteForGiver !== undefined ||
      dto.declineMessage !== undefined ||
      dto.interests !== undefined ||
      dto.noInterest !== undefined
    );
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
