import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { Guest } from 'src/guests/entities/guest.entity';
import { Event } from 'src/events/entities/event.entity';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), forwardRef(() => EventsModule)],
  controllers: [AssignmentController],
  providers: [AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule {}
