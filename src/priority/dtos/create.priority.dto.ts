import { IsString } from 'class-validator';

export class CreatePriorityRequest {
  @IsString()
  title: string;
}
