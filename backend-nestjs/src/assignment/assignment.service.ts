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
  // drawrules CHAIN = 'chain',  EXCHANGE = 'exchange',  PICK_ORDER = 'pick-order',
  // TODO exclusion rules
  // chain = everyperson randomly get's assigned another one
  async chainDraw(eventid: string) {
    const event = await this.EventRepository.findOne({ where: { id: eventid }, relations: ['guests'] });
    if (!event || !event?.guests) throw new NotFoundException();

    //shuffle with fisher-yates
    const shuffle = (guests: Guest[]): Guest[] => {
      for (let i = guests.length - 1; i > 0; i--) {
        const randomNumber = Math.floor(Math.random() * (i + 1));
        [guests[i], guests[randomNumber]] = [guests[randomNumber], guests[i]];
      }

      return guests;
    };

    const randomisedGuests: Guest[] = shuffle(event.guests);

    for (const [index, guest] of randomisedGuests.entries()) {
      const nextGuest = randomisedGuests[(index + 1) % randomisedGuests.length];

      const findguest = await this.GuestRepository.findOne({ where: { id: guest.id } });
      if (!findguest) throw new NotFoundException();

      findguest.assignedRecipient = nextGuest;

      await this.GuestRepository.save(findguest);
    }

    event.status = EventStatus.ASSIGNED;

    await this.EventRepository.save(event);
  }

  //
  // exchange = a to b, b to a
  //
  // pick-order = just a list, in which order people get to pick
}
