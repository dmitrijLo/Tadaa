import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { InterestOption } from './entities/interest-option.entity';
import { GuestInterest } from './entities/guest-interest.entity';
import { GuestNoInterest } from './entities/guest-no-interest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterestOption,
      GuestInterest,
      GuestNoInterest,
    ]),
  ],
  controllers: [InterestsController],
  providers: [InterestsService],
  exports: [TypeOrmModule],
})
export class InterestsModule {}
