import { IsNotEmpty } from 'class-validator';
import { CreateUserResponse } from 'src/user/dtos/create.user.dto';

export class CreateCommentRequest {
  @IsNotEmpty()
  content: string;
}

export class CreateCommentResponse {
  id: string;

  content: string;

  createdBy: CreateUserResponse;

  createdAt?: Date;

  updatedAt?: Date;
}
