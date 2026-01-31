import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { Guest } from './entities/guest.entity';
import { InterestOption } from '../interests/entities/interest-option.entity';
import { InterestsModule } from '../interests/interests.module';
import { BullModule } from '@nestjs/bullmq';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    AssignmentModule,
    InterestsModule,
    TypeOrmModule.forFeature([Guest, Event, InterestOption]),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [GuestsController],
  providers: [GuestsService],
  exports: [TypeOrmModule, GuestsService],
})
export class GuestsModule {}
