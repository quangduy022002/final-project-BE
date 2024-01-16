import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserRequest {
  @Length(5)
  @IsNotEmpty()
  username: string;

  @Length(8)
  @IsNotEmpty()
  password: string;

  @Length(8)
  @IsNotEmpty()
  retypedPassword: string;

  @Length(2)
  @IsNotEmpty()
  firstName: string;

  @Length(2)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
