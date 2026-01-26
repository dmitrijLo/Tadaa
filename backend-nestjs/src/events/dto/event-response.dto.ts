import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DrawRule, EventMode } from 'src/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ description: 'Limit per page', minimum: 1, maximum: 100, default: 10 })
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Current page', minimum: 1, default: 1 })
  page: number = 1;
}

export class EventResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  budget: number;
  @Expose()
  currency: string;
  @Expose()
  eventMode: EventMode;
  @Expose()
  drawRule: DrawRule;
  @Expose()
  eventDate: Date;
  @Expose()
  invitationDate: Date;
  @Expose()
  draftDate: Date;
}

class PaginationMetaDto {
  @ApiProperty()
  total: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  lastPage: number;
}

export class PaginatedEventsResponse {
  @ApiProperty({ type: [EventResponseDto] })
  data: EventResponseDto[];
  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
