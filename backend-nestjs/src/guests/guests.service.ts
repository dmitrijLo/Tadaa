import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';
import { InviteStatus } from '../enums';

import { randomUUID } from 'crypto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const { email, eventId } = createGuestDto;
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
      relations: ['event'],
    });
    return guest;
  }

  findAll() {
    return `This action returns all guests`;
  }

  update(id: number, updateGuestDto: UpdateGuestDto) {
    return `This action updates a #${id} guest`;
  }

  remove(id: number) {
    return `This action removes a #${id} guest`;
  }
}
