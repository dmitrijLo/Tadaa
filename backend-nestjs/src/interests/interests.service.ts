import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestOption } from './entities/interest-option.entity';
import { Repository } from 'typeorm';
import { CreateInterestDto } from './dto/create-interest.dto';
import { InterestDto } from './dto/interest.dto';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(InterestOption)
    private readonly InterestOptionRepository: Repository<InterestOption>,
  ) {}

  async create(interest: CreateInterestDto): Promise<InterestDto> {
    const interestToCreate = this.InterestOptionRepository.create(interest);
    await this.InterestOptionRepository.save(interestToCreate);
    return interestToCreate;
  }

  // a list of all interest options in db
  async findAll(): Promise<InterestDto[]> {
    return await this.InterestOptionRepository.find();
  }
}
