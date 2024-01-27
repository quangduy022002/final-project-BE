import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { DeleteResult, Repository } from 'typeorm';
import {
  CreateCommentRequest,
  CreateCommentResponse,
} from './dtos/create.comment.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private getCommentsBaseQuery() {
    return this.commentRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getAllComments(): Promise<Comment[]> {
    return await this.getCommentsBaseQuery()
      .leftJoin('e.createdBy', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
      ])
      .getMany();
  }

  public async getComment(id: string): Promise<Comment | undefined> {
    const result = await this.getCommentsBaseQuery()
      .leftJoin('e.createdBy', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
      ])
      .andWhere('e.id = :id', {
        id,
      })
      .getOne();

    return { ...result, createdBy: result.createdBy };
  }

  public async createComment(
    input: CreateCommentRequest,
    user: User,
  ): Promise<CreateCommentResponse> {
    const createdAt = new Date();

    const createdComment = await this.commentRepository.save({
      ...input,
      createdAt,
      updatedAt: new Date(),
      createdBy: user,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user;
    return {
      ...createdComment,
      createdBy: info,
    };
  }

  public async updateComment(
    comment: Comment,
    input: CreateCommentRequest,
    user: User,
  ): Promise<CreateCommentResponse> {
    const updatedAt = new Date();

    if (comment.createdBy.id === user.id) {
      const updatedComment = await this.commentRepository.save({
        ...comment,
        ...input,
        updatedAt,
        createdBy: user,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...info } = user;
      return {
        ...updatedComment,
        createdBy: info,
      };
    }
    throw new BadRequestException('You can not update this comment');
  }

  public async deleteComment(
    id: string,
    createdByUserId: string,
  ): Promise<DeleteResult> {
    return await this.commentRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id AND createdBy = :createdByUserId', {
        id,
        createdByUserId,
      })
      .execute();
  }
}
