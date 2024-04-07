import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InviteUserProjectRequest {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  message: string;
}

export class InviteUserProjectResponse {
  status: boolean;
}
