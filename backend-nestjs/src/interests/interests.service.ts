import { Injectable } from '@nestjs/common';
//import { CreateInterestDto } from './dto/create-interest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestOption } from './entities/interest-option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(InterestOption)
    private readonly InterestOptionRepository: Repository<InterestOption>,
  ) {}

  //  create(createInterestDto: CreateInterestDto) {
  //  return 'This action adds a new interest';
  //}

  findAll() {
    return this.InterestOptionRepository.find();
  }
}
