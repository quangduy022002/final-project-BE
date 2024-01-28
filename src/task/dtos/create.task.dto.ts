import { IsNotEmpty } from 'class-validator';
import { Comment } from 'src/comment/entity/comment.entity';
import { Priority } from 'src/priority/entity/priority.entity';
import { Section } from 'src/section/entity/section.entity';
import { GetTimeResponse } from 'src/time/dtos/create.time.dto';
import { Type } from 'src/type/entity/type.entity';
import { GetUserResponse } from 'src/user/dtos/create.user.dto';

export class CreateTaskRequest {
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
  teamUsers: string[];
}

export class GetTaskResponse {
  id: string;

  name: string;

  description: string;

  status: Section;

  type: Type;

  priority: Priority;

  time: GetTimeResponse;

  createdBy?: GetUserResponse;

  teamUsers?: GetUserResponse[];

  comments?: Comment[];
}
