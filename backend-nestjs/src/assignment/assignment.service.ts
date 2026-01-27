import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from 'src/guests/entities/guest.entity';
import { Event } from 'src/events/entities/event.entity';
import { Repository } from 'typeorm';
import { EventStatus } from 'src/enums/enums';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Guest)
    @InjectRepository(Event)
    private readonly GuestRepository: Repository<Guest>,
    private readonly EventRepository: Repository<Event>,
  ) {}

  // Fisher-Yates, shuffle object of arrays
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomNumber = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomNumber]] = [shuffled[randomNumber], shuffled[i]];
    }
    return shuffled;
  }

  //fetch event
  private async getEventWithGuests(eventId: string, relations: string[] = ['guests']): Promise<Event> {
    const event = await this.EventRepository.findOne({ where: { id: eventId }, relations });
    if (!event || !event?.guests) throw new NotFoundException();
    return event;
  }

  //update status
  private async markEventAssigned(event: Event): Promise<void> {
    event.status = EventStatus.ASSIGNED;
    await this.EventRepository.save(event);
  }

  // TODO: add functinality to algorhythm  that ensures that selected paople can not gift echother
  // DRAWMODES
  // chain, one person gifts to the next, the last gifts the first
  async chainDraw(eventId: string) {
    const event = await this.getEventWithGuests(eventId);
    const randomisedGuests = this.shuffle(event.guests);

    for (const [index, guest] of randomisedGuests.entries()) {
      const nextGuest = randomisedGuests[(index + 1) % randomisedGuests.length];
      const findguest = await this.GuestRepository.findOne({ where: { id: guest.id } });
      if (!findguest) throw new NotFoundException();

      findguest.assignedRecipient = nextGuest;
      await this.GuestRepository.save(findguest);
    }

    await this.markEventAssigned(event);
  }

  //EXCHANGE
  // pairs exchange gifts, if uneven number host does not participate
  async exchangeDraw(eventId: string) {
    const event = await this.getEventWithGuests(eventId, ['guests', 'host']);
    let guestsToAssign = [...event.guests];

    if (guestsToAssign.length % 2 !== 0) {
      const hostEmail = event.host?.email;
      guestsToAssign = guestsToAssign.filter((guest) => guest.email !== hostEmail);
    }

    const randomisedGuests = this.shuffle(guestsToAssign);

    for (let i = 0; i < randomisedGuests.length; i += 2) {
      const guestA = await this.GuestRepository.findOne({ where: { id: randomisedGuests[i].id } });
      const guestB = await this.GuestRepository.findOne({ where: { id: randomisedGuests[i + 1].id } });
      if (!guestA || !guestB) throw new NotFoundException();

      guestA.assignedRecipient = randomisedGuests[i + 1];
      guestB.assignedRecipient = randomisedGuests[i];

      await this.GuestRepository.save(guestA);
      await this.GuestRepository.save(guestB);
    }

    await this.markEventAssigned(event);
  }

  //PICKORDER
  //just a random ordering of the participants, assigned a number that indicates when is their turn to select a gift
  async pickOrderDraw(eventId: string) {
    const event = await this.getEventWithGuests(eventId);
    const randomisedGuests = this.shuffle(event.guests);

    for (const [index, guest] of randomisedGuests.entries()) {
      const findguest = await this.GuestRepository.findOne({ where: { id: guest.id } });
      if (!findguest) throw new NotFoundException();

      findguest.pickOrder = index + 1;
      await this.GuestRepository.save(findguest);
    }

    await this.markEventAssigned(event);
  }
}
