import { IsNotEmpty, IsString } from 'class-validator';

export class AssignUserProjectDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
