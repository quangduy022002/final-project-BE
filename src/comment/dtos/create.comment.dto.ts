import { IsNotEmpty } from 'class-validator';

export class CreateCommentRequest {
  @IsNotEmpty()
  content: string;
}

export class CreateCommentResponse {
  id: string;

  content: string;

  createdBy: string;

  createdAt?: Date;

  updatedAt?: Date;
}
