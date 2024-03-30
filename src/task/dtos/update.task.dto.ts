import { IsNotEmpty } from 'class-validator';

export class UpdateTaskRequest {
  @IsNotEmpty()
  name: string;

  description: string;

  @IsNotEmpty()
  statusId: number;

  @IsNotEmpty()
  typeId: number;

  @IsNotEmpty()
  priorityId: number;

  originalTime?: number;

  @IsNotEmpty()
  estimateTime: number;

  @IsNotEmpty()
  deadline: string;

  @IsNotEmpty()
  teamUsers: string[];
}
