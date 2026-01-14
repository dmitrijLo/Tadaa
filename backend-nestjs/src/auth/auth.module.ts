import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtDevGuard } from './guards/jwt-dev.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [JwtDevGuard, AuthService],
  exports: [JwtDevGuard, AuthService],
})
export class AuthModule {}
