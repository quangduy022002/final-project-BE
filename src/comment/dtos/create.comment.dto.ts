import { IsNotEmpty } from 'class-validator';
import { GetUserResponse } from 'src/user/dtos/create.user.dto';

export class CreateCommentRequest {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  taskId: string;
}

export class GetCommentResponse {
  id: string;

  content: string;

  createdBy: GetUserResponse;

  createdAt?: Date;

  updatedAt?: Date;

  taskId: string;
}
