import { Injectable } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  // get guestpage by token
  async findOneByToken(token: string) {
    const guest = await this.guestRepository.findOne({
      where: { inviteToken: token },
      relations: ['event'],
    });
    return guest;
  }

  // default generate resources
  create(createGuestDto: CreateGuestDto) {
    return 'This action adds a new guest';
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
