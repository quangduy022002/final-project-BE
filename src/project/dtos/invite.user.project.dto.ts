import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteUserProjectRequest {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class InviteUserProjectResponse {
  status: boolean;
}
