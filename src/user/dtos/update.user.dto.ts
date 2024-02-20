import { IsDate, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsDate()
  dob: Date;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
