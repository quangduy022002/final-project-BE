import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Section } from 'src/section/entity/section.entity';
import { GetUserResponse } from 'src/user/dtos/create.user.dto';

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

export class GetProjectResponse {
  id: string;

  name: string;

  description: string;

  category: string;

  sections: Array<Section>;

  teamUsers: Array<GetUserResponse>;

  createdBy: GetUserResponse;
}
