import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { InviteStatus } from 'src/enums';

export class BaseGuestDto {
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
}

export class CreateGuestDto extends BaseGuestDto {}
