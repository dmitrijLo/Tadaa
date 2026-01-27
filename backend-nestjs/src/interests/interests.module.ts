import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { InterestOption } from './entities/interest-option.entity';
import { Guest } from 'src/guests/entities/guest.entity';
import { GuestInterestsService } from './guestInterests.service';
import { GiftRecommendationService } from './giftRecommendation.service';

@Module({
  imports: [TypeOrmModule.forFeature([InterestOption, Guest])],
  controllers: [InterestsController],
  providers: [InterestsService, GuestInterestsService, GiftRecommendationService],
  exports: [TypeOrmModule, InterestsService, GiftRecommendationService],
})
export class InterestsModule {}
