import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';
import { InterestOption } from '../interests/entities/interest-option.entity';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
    @InjectRepository(InterestOption)
    private interestOptionRepository: Repository<InterestOption>,
  ) {}

  // get guestpage by token
  async findOneByToken(token: string) {
    const guest = await this.guestRepository.findOne({
      where: { inviteToken: token },
      relations: ['event', 'interests'],
    });
    return guest;
  }

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
