import { IsUUID } from 'class-validator';

export class GuestInterestDto {
  @IsUUID()
  interestId: string;
}
