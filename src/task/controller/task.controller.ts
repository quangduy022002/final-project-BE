import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from '../task.service';
import { CreateTaskRequest, GetTaskResponse } from '../dtos/create.task.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { DeleteResult } from 'typeorm';
import { AssignUserProjectRequest } from 'src/project/dtos/assign.user.project.dto';

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

  @Patch('update/:id')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async update(
    @Param('id') id,
    @Body() input: CreateTaskRequest,
    @CurrentUser() user: User,
  ): Promise<GetTaskResponse> {
    const task = await this.taskService.getTaskDetail(id);

    return await this.taskService.updateTask(task, input, user);
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async remove(@Param('id') id): Promise<DeleteResult> {
    return await this.taskService.deleteTask(id);
  }

  @Post('assignMemberToTask/:id')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async assignMemberTask(
    @Param('id') id,
    @Body() memberId: AssignUserProjectRequest,
    @CurrentUser() user: User,
  ): Promise<GetTaskResponse> {
    const task = await this.taskService.getTaskDetail(id);

    return await this.taskService.assignMemberToTask(memberId, task, user);
  }

  @Post('removeMemberToTask/:id')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async removeMemberTask(
    @Param('id') id,
    @Body() memberId: AssignUserProjectRequest,
    @CurrentUser() user: User,
  ): Promise<GetTaskResponse> {
    const task = await this.taskService.getTaskDetail(id);

    return await this.taskService.removeMemberToTask(memberId, task, user);
  }
}
