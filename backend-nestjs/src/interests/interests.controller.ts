import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Delete } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { InterestDto } from './dto/interest.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { GuestInterestReqDto } from './dto/guest-interst.dto';
import { GuestInterestsService } from './guestInterests.service';
import { NoteForGiverDto } from './dto/interest-note.dto';
import { GiftRecommendationService } from './giftRecommendation.service';

@Controller('interests')
export class InterestsController {
  constructor(
    private readonly interestsService: InterestsService,
    private readonly guestInterestService: GuestInterestsService,
    private readonly giftRecommondationService: GiftRecommendationService,
  ) {}

  // get all interest
  @Public()
  @Get()
  findAll(): Promise<InterestDto[]> {
    return this.interestsService.findAll();
  }

  @Public()
  @Post()
  create(@Body() createInterestDto: CreateInterestDto): Promise<InterestDto> {
    return this.interestsService.create(createInterestDto);
  }

  // add interest/no interest to guest (public - UUID acts as access token)
  @Public()
  @Post(':guestId')
  addGuestInterest(@Param('guestId', ParseUUIDPipe) guestId: string, @Body() guestInterestDto: GuestInterestReqDto) {
    return this.guestInterestService.addGuestInterest(guestId, guestInterestDto);
  }

  // remove interest from guest (public - UUID acts as access token)
  @Public()
  @Delete(':guestId')
  removeGustInterest(@Param('guestId', ParseUUIDPipe) guestId: string, @Body() guestInterestDto: GuestInterestReqDto) {
    return this.guestInterestService.removeGuestInterest(guestId, guestInterestDto);
  }

  // guest adds note for gift giver (public - UUID acts as access token)
  @Public()
  @Post(':guestId/note')
  addNoteForGiver(@Param('guestId', ParseUUIDPipe) guestId: string, @Body() noteDto: NoteForGiverDto) {
    return this.guestInterestService.submitNoteForGiver(guestId, noteDto.noteForGiver);
  }

  // get AI gift suggestions (public - UUID acts as access token)
  @Public()
  @Get(':guestId/suggestions')
  getGiftSuggestions(@Param('guestId', ParseUUIDPipe) guestId: string) {
    return this.giftRecommondationService.generateRecommendation(guestId);
  }
}
