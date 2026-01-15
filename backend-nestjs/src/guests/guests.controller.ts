import { Controller, Get, Param, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { GuestsService } from './guests.service';

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
}
