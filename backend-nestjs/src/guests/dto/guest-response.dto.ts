import { ApiProperty } from '@nestjs/swagger';
import { BaseGuestDto } from './create-guest.dto';
import { InviteStatus } from 'src/enums';
import { Expose } from 'class-transformer';

export class GuestResponseDto extends BaseGuestDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  noteForGiver: string | null;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  declineMessage: string | null;

  @Expose()
  @ApiProperty({ enum: InviteStatus })
  inviteStatus: InviteStatus;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  receivedAt: Date | null;

  @Expose()
  @ApiProperty({ required: false, nullable: true })
  openedAt: Date | null;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
