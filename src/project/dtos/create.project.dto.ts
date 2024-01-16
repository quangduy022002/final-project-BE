import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsArray()
  sections: number[];

  @IsNotEmpty()
  teamUsers: string[];
}
