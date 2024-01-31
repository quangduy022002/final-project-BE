import { IsString } from 'class-validator';

export class CreatePriorityRequest {
  @IsString()
  name: string;
}
