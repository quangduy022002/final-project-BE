import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}
