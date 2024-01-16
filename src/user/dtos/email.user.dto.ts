import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
