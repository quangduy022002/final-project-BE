import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Section } from 'src/section/entity/section.entity';
import { User } from 'src/user/entity/user.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  sections: Section[];

  @IsNotEmpty()
  teamUsers: User[];
}
