import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDate, Min, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EventMode, DrawRule } from '../../enums';
import { IsAfterToday, IsBeforeField, IsBetweenFields } from './validators/date-validators';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEnum(EventMode)
  eventMode: EventMode;

  @IsEnum(DrawRule)
  drawRule: DrawRule;

  @IsDate()
  @Type(() => Date)
  @IsAfterToday()
  eventDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsBeforeField('eventDate')
  invitationDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsBetweenFields('invitationDate', 'eventDate')
  draftDate?: Date;
}
