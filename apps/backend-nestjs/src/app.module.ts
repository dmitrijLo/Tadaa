import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { GuestsModule } from './guests/guests.module';
import { InterestsModule } from './interests/interests.module';
import { AuthModule } from './auth/auth.module';

const REMOTE_DB_OPTIONS = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
};

const LOKAL_DB_OPTIONS = {
  url: process.env.DATABASE_HOST,
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.HAS_LOKAL_DB ? LOKAL_DB_OPTIONS : REMOTE_DB_OPTIONS),
      autoLoadEntities: true,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development' ? true : ['error'],
    }),
    UsersModule,
    EventsModule,
    GuestsModule,
    InterestsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
