import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ example: 'Max Power' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'maxpower@web.de',
    description: 'valid email address',
  })
  @IsEmail()
  email: string;

  // TODO: nicht sicher ob das in die API gehört
  // @ApiProperty({ description: 'The UUID of the event' })
  @IsUUID()
  eventId: string;
}
