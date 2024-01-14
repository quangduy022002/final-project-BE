import { IsNotEmpty, IsNumber } from 'class-validator';

export class CodeAuthDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
