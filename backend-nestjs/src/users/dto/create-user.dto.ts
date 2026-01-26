import { IsEmail, IsString, IsUUID } from 'class-validator';

class BaseUser {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

export class BaseUserDto extends BaseUser {
  @IsUUID()
  id: string;
}

export class CreateUserDto extends BaseUser {
  @IsString()
  passwordHash: string;
}
