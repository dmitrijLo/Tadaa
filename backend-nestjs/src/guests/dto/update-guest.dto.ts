import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { InterestOption } from 'src/interests/entities/interest-option.entity';
import { CreateGuestDto } from './create-guest.dto';
import { IsArray, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateGuestDto extends PartialType(CreateGuestDto) {
  @Expose()
  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  noteForGiver?: string | null;

  @Expose()
  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  declineMessage?: string | null;

  @Expose()
  @ApiProperty({ type: [InterestOption] })
  @IsArray()
  @IsOptional()
  noInterest?: InterestOption[];

  @Expose()
  @ApiProperty({ type: [InterestOption] })
  @IsArray()
  @IsOptional()
  interests?: InterestOption[];

  @Expose()
  @ApiProperty({ nullable: true })
  @IsUUID()
  @IsOptional()
  parentId?: string | null;

  @Expose()
  @ApiProperty({ nullable: true })
  @IsInt()
  @IsOptional()
  orderIndex?: number | null;
}
