import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from 'src/guests/entities/guest.entity';
import { Event } from 'src/events/entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { DrawRule, EventStatus } from 'src/enums/enums';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Event)
    private readonly EventRepository: Repository<Event>,
    private readonly dataSource: DataSource,
  ) {}

  // Main draw method - orchestrates the flow
  // Note: CHAIN creates a directed cycle (no circular pairs), EXCHANGE creates mutual pairs by design
  async draw(eventId: string) {
    const fullEvent = await this.EventRepository.findOne({
      where: { id: eventId },
      relations: ['guests', 'host'],
    });
    if (!fullEvent || !fullEvent.guests) throw new NotFoundException();

    const drawMethods: Record<DrawRule, () => Guest[]> = {
      [DrawRule.CHAIN]: () => this.chainAssign(fullEvent),
      [DrawRule.EXCHANGE]: () => this.exchangeAssign(fullEvent),
      [DrawRule.PICK_ORDER]: () => this.pickOrderAssign(fullEvent),
    };

    const assignedGuests = drawMethods[fullEvent.drawRule]();

    // Save all assignments atomically
    await this.dataSource.transaction(async (manager) => {
      await manager.save(Guest, assignedGuests);
      fullEvent.status = EventStatus.ASSIGNED;
      await manager.save(Event, fullEvent);
    });
  }

  // DRAWMODES
  // chain, one person gifts to the next, the last gifts the first
  private chainAssign(event: Event): Guest[] {
    const shuffled = this.shuffle(event.guests);
    for (const [index, guest] of shuffled.entries()) {
      guest.assignedRecipient = shuffled[(index + 1) % shuffled.length];
    }
    return shuffled;
  }

  // EXCHANGE
  // pairs exchange gifts, if uneven number host does not participate
  private exchangeAssign(event: Event): Guest[] {
    let guests = [...event.guests];
    if (guests.length % 2 !== 0) {
      const hostEmail = event.host?.email;
      guests = guests.filter((g) => g.email !== hostEmail);
    }
    const shuffled: Guest[] = this.shuffle(guests);
    for (let i = 0; i < shuffled.length; i += 2) {
      shuffled[i].assignedRecipient = shuffled[i + 1];
      shuffled[i + 1].assignedRecipient = shuffled[i];
    }
    return shuffled;
  }

  // PICKORDER
  // just a random ordering of the participants, assigned a number that indicates when is their turn to select a gift
  private pickOrderAssign(event: Event): Guest[] {
    const shuffled = this.shuffle(event.guests);
    for (const [index, guest] of shuffled.entries()) {
      guest.pickOrder = index + 1;
    }
    return shuffled;
  }

  // Fisher-Yates, shuffle object of arrays
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomNumber = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomNumber]] = [shuffled[randomNumber], shuffled[i]];
    }
    return shuffled;
  }
}
