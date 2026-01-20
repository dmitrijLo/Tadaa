import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { Guest } from './entities/guest.entity';
import { Event } from 'src/events/entities/event.entity';
import { InterestOption } from '../interests/entities/interest-option.entity';
import { InterestsModule } from '../interests/interests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest, Event, InterestOption]),
    InterestsModule,
  ],
  controllers: [GuestsController],
  providers: [GuestsService],
  exports: [TypeOrmModule, GuestsService],
})
export class GuestsModule {}
