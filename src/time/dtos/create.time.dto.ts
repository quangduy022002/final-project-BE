import { IsNumber } from 'class-validator';

export class CreateTimeRequest {
  @IsNumber()
  estimateTime: number;

  @IsNumber()
  originalTime: number;
}

export class GetTimeResponse {
  estimateTime: number;
  originalTime: number;
}
