import { IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  description: string;

  category: string;

  section: string;

  // teamUsers:
}
