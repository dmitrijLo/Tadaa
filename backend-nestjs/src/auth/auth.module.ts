import { Module } from '@nestjs/common';
import { JwtDevGuard } from './guards/jwt-dev.guard';

@Module({
  providers: [JwtDevGuard],
  exports: [JwtDevGuard],
})
export class AuthModule {}
