import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TaskService } from '../task.service';
import { CreateTaskRequest, GetTaskResponse } from '../dtos/create.task.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('getAll')
  async findAll(): Promise<GetTaskResponse[]> {
    return await this.taskService.getAllTasks();
  }

  @Get('taskDetail/:id')
  @ApiParam({
    name: 'id',
  })
  async getOne(@Param('id') id): Promise<GetTaskResponse> {
    return await this.taskService.getTaskDetail(id);
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body() input: CreateTaskRequest,
    @CurrentUser() user: User,
  ): Promise<GetTaskResponse> {
    return await this.taskService.createTask(input, user);
  }
}
