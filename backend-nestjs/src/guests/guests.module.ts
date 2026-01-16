import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { Guest } from './entities/guest.entity';
import { Event } from 'src/events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Event])],
  controllers: [GuestsController],
  providers: [GuestsService],
  exports: [TypeOrmModule, GuestsService],
})
export class GuestsModule {}
