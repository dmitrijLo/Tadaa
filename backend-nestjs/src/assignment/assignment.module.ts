import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { Guest } from 'src/guests/entities/guest.entity';
import { Event } from 'src/events/entities/event.entity';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Event]), EventsModule],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
