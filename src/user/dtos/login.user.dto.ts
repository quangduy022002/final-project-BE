import { IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @Length(5)
  @IsNotEmpty()
  username: string;

  @Length(8)
  @IsNotEmpty()
  password: string;
}
