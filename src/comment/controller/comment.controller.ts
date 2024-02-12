import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../comment.service';
import {
  CreateCommentRequest,
  GetCommentResponse,
  UpdateCommentRequest,
} from '../dtos/create.comment.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('getAll')
  async findAll(): Promise<GetCommentResponse[]> {
    return await this.commentService.getAllComments();
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body() input: CreateCommentRequest,
    @CurrentUser() user: User,
  ): Promise<GetCommentResponse> {
    return await this.commentService.createComment(input, user);
  }

  @Patch('update/:id')
  @ApiParam({
    name: 'id',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id') id,
    @Body() input: UpdateCommentRequest,
    @CurrentUser() user: User,
  ): Promise<GetCommentResponse> {
    const comment = await this.commentService.getComment(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentService.updateComment(comment, input, user);
  }

  @Delete('remove/:id')
  @ApiParam({
    name: 'id',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id') id,
    @CurrentUser() user: User,
  ): Promise<DeleteResult> {
    const comment = await this.commentService.getComment(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentService.deleteComment(id, user.id);
  }
}
