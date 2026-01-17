import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestOption } from './entities/interest-option.entity';
import { Repository } from 'typeorm';
import { Guest } from 'src/guests/entities/guest.entity';
import { GuestInterestReqDto } from './dto/guest-interst.dto';

@Injectable()
export class GuestInterestsService {
  constructor(
    @InjectRepository(InterestOption)
    private readonly InterestOptionRepository: Repository<InterestOption>,
    @InjectRepository(Guest)
    private readonly GuestRepository: Repository<Guest>,
  ) {}

  // add interest to either relationship of guest interest or no_interest
  // find guest by id, like: true =interest | false = no_interest,

  async addGuestInterest(guestId: string, guestInterestDto: GuestInterestReqDto) {
    const { like, interestId } = guestInterestDto;
    const relationship = like ? 'interests' : 'no_interests';

    const guest = await this.GuestRepository.findOne({
      where: { id: guestId },
      relations: [relationship],
    });
    if (!guest) throw new NotFoundException('Guest not found');

    const interest = await this.InterestOptionRepository.findOne({ where: { id: interestId } });
    if (!interest) throw new NotFoundException('Interest option not found');

    if (!guest[relationship].some((i) => i.id === interestId)) {
      guest[relationship].push(interest);
      await this.GuestRepository.save(guest);
    } else throw new ConflictException('Interest already added');

    return { [relationship]: guest[relationship] };
  }

  async removeGuestInterest(guestId: string, guestInterestDto: GuestInterestReqDto) {
    const { like, interestId } = guestInterestDto;
    const relationship = like ? 'interests' : 'no_interests';

    const guest = await this.GuestRepository.findOne({
      where: { id: guestId },
      relations: [relationship],
    });
    if (!guest) throw new NotFoundException('Could not find guest');

    if (guest[relationship].some((interest: InterestOption) => interest.id === interestId)) {
      guest[relationship] = guest[relationship].filter((interest: InterestOption) => interest.id !== interestId);

      await this.GuestRepository.save(guest);
    } else {
      throw new NotFoundException('This interest was already deleted or never existed');
    }

    return guest[relationship];
  }
}
