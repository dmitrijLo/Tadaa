import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class NoteForGiverDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Note should not be empty' })
  @MaxLength(256, { message: 'Note is too long (maximum 256 characters)' })
  noteForGiver: string;
}
