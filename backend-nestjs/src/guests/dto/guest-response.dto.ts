import { ApiProperty } from '@nestjs/swagger';
import { BaseGuestDto } from './create-guest.dto';
import { InviteStatus } from 'src/enums';
export class GuestResponseDto extends BaseGuestDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  noteForGiver: string | null;

  @ApiProperty({ required: false, nullable: true })
  declineMessage: string | null;

  @ApiProperty({ enum: InviteStatus })
  inviteStatus: InviteStatus;

  @ApiProperty({ required: false, nullable: true })
  receivedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  openedAt: Date | null;

  @ApiProperty()
  createdAt: Date;
}
