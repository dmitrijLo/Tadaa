import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { InterestOption } from './entities/interest-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterestOption])],
  controllers: [InterestsController],
  providers: [InterestsService],
  exports: [TypeOrmModule, InterestsService],
})
export class InterestsModule {}
