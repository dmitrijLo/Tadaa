import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Delete } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { InterestDto } from './dto/interest.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GuestInterestReqDto } from './dto/guest-interst.dto';
import { GuestInterestsService } from './guestInterests.service';
import { NoteForGiverDto } from './dto/interest-note.dto';

@Controller('interests')
export class InterestsController {
  constructor(
    private readonly interestsService: InterestsService,
    private readonly guestInterestService: GuestInterestsService,
  ) {}

  // get all interest
  @Public()
  @Get()
  findAll(): Promise<InterestDto[]> {
    return this.interestsService.findAll();
  }

  @Post()
  create(@Body() createInterestDto: CreateInterestDto): Promise<InterestDto> {
    return this.interestsService.create(createInterestDto);
  }

  // add interst/no interest to guest:
  // body should have interstId and like:bool indicating if this is an interest or a nointerest
  @Post(':guestId')
  addGuestInterest(@Param('guestId', ParseUUIDPipe) guestId: string, @Body() guestInterestDto: GuestInterestReqDto) {
    return this.guestInterestService.addGuestInterest(guestId, guestInterestDto);
  }

  // remove interest from guest
  // same body as add above
  @Delete(':guestId')
  removeGustInterest(@Param('guestId', ParseUUIDPipe) guestId: string, @Body() guestInterestDto: GuestInterestReqDto) {
    return this.guestInterestService.removeGuestInterest(guestId, guestInterestDto);
  }

  @Post(':guestId/note')
  addNoteForGiver(@Param('guestId', ParseUUIDPipe) guestId: string, @Body() noteDto: NoteForGiverDto) {
    return this.guestInterestService.submitNoteForGiver(guestId, noteDto.noteForGiver);
  }
}
