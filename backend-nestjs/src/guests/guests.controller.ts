import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestInterestDto } from './dto/guest-interest.dto';
import { JwtDevGuard } from '../auth/guards/jwt-dev.guard';

interface RequestWithUser {
  user: {
    id: string;
  };
}

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get(':token')
  async findByToken(@Param('token', ParseUUIDPipe) token: string) {
    const guest = await this.guestsService.findOneByToken(token);
    if (!guest) {
      throw new NotFoundException('Guest not found');
    }
    return guest;
  }

  @Post('interests')
  @UseGuards(JwtDevGuard)
  @HttpCode(HttpStatus.OK)
  addInterestToGuest(
    @Req() req: RequestWithUser,
    @Body() guestInterestDto: GuestInterestDto,
  ) {
    const guestId = req.user.id;
    return this.guestsService.addInterestToGuest(
      guestId,
      guestInterestDto.interestId,
    );
  }

  @Delete('interests')
  @UseGuards(JwtDevGuard)
  @HttpCode(HttpStatus.OK)
  removeInterestFromGuest(
    @Req() req: RequestWithUser,
    @Body() guestInterestDto: GuestInterestDto,
  ) {
    const guestId = req.user.id;
    return this.guestsService.removeInterestFromGuest(
      guestId,
      guestInterestDto.interestId,
    );
  }
}
