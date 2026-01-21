import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class BaseGuestDto {
  @Expose()
  @ApiProperty({ example: 'Max Power' })
  @IsString()
  @MinLength(2)
  name: string;

  @Expose()
  @ApiProperty({
    example: 'maxpower@web.de',
    description: 'valid email address',
  })
  @IsEmail()
  email: string;
}

export class CreateGuestDto extends BaseGuestDto {}
