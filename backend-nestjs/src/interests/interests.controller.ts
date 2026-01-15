import { Controller, Get, Post, Body } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { InterestDto } from './dto/interest.dto';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get()
  findAll(): Promise<InterestDto[]> {
    return this.interestsService.findAll();
  }

  @Post()
  create(@Body() createInterestDto: CreateInterestDto): Promise<InterestDto> {
    return this.interestsService.create(createInterestDto);
  }
}
