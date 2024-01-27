import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Section } from 'src/section/entity/section.entity';
import { CreateUserResponse } from 'src/user/dtos/create.user.dto';

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

export class CreateProjectResponse {
  id: string;

  title: string;

  description: string;

  category: string;

  sections: Array<Section>;

  teamUsers: Array<CreateUserResponse>;

  createdBy: CreateUserResponse;
}
