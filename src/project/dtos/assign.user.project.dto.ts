import { IsNotEmpty, IsString } from 'class-validator';

export class AssignUserProjectRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
