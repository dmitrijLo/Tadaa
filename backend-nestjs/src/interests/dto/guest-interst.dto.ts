import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class GuestInterestReqDto {
  @IsNotEmpty()
  @IsUUID()
  interestId: string;

  @IsNotEmpty()
  @IsBoolean()
  like: boolean;
}
