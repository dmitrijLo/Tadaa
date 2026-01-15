import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { Guest } from './entities/guest.entity';
import { InterestOption } from '../interests/entities/interest-option.entity';
import { InterestsModule } from '../interests/interests.module';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, InterestOption]), InterestsModule],
  controllers: [GuestsController],
  providers: [GuestsService],
  exports: [TypeOrmModule],
})
export class GuestsModule {}
