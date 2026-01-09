import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { GuestsModule } from './guests/guests.module';
import { InterestsModule } from './interests/interests.module';

@Module({
  imports: [UsersModule, EventsModule, GuestsModule, InterestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
