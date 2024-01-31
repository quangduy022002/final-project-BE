import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTaskRequest, GetTaskResponse } from './dtos/create.task.dto';
import { User } from 'src/user/entity/user.entity';
import { GetUserResponse } from 'src/user/dtos/create.user.dto';
import { UserService } from 'src/user/user.service';
import { SectionService } from 'src/section/section.service';
import { PriorityService } from 'src/priority/priority.service';
import { TypeService } from 'src/type/type.service';
import { GetTimeResponse } from 'src/time/dtos/create.time.dto';
import { ProjectService } from 'src/project/project.service';
import { AssignUserProjectRequest } from 'src/project/dtos/assign.user.project.dto';
import { Comment } from 'src/comment/entity/comment.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly sectionService: SectionService,
    private readonly priorityService: PriorityService,
    private readonly typeService: TypeService,
    private readonly projectService: ProjectService,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private getTasksBaseQuery() {
    return this.taskRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  private async getAllCommentByTask(id: string): Promise<Comment[]> {
    return await this.commentRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
      .leftJoin('e.createdBy', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.firstName',
        'user.lastName',
      ])
      .andWhere('e.taskId = :id', { id })
      .getMany();
  }

  private async mapTeamUsers(data): Promise<GetUserResponse[]> {
    const teamUserPromise: Promise<GetUserResponse>[] = data.map(
      async (user: string) => {
        return await this.userService.getUser(user);
      },
    );

    const teamUsers: GetUserResponse[] = await Promise.all(teamUserPromise);

    return teamUsers;
  }

  private async updateTeamUser(
    task: GetTaskResponse,
    member: GetUserResponse,
    flag: string = '',
  ): Promise<GetUserResponse[]> {
    const updatedTeamUsers: GetUserResponse[] = [...task.teamUsers];
    if (!flag) {
      if (
        !updatedTeamUsers.some(
          (existingMember: User) => existingMember.id === member.id,
        )
      ) {
        updatedTeamUsers.push(member);
      }

      const teamUsers = await this.mapTeamUsers(
        updatedTeamUsers.map((user) => user.id),
      );
      return teamUsers;
    } else {
      if (
        updatedTeamUsers.some(
          (existingMember: User) => existingMember.id === member.id,
        )
      ) {
        return updatedTeamUsers.filter((user: User) => user.id !== member.id);
      } else {
        throw new BadRequestException('Member is not founded in project!');
      }
    }
  }

  public async getAllTasks(): Promise<GetTaskResponse[]> {
    return await this.getTasksBaseQuery()
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

  public async getTaskDetail(id: string): Promise<GetTaskResponse> {
    const query = await this.getTasksBaseQuery()
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
      });
    const task = await query.getOne();

    if (!task) throw new BadRequestException('Task not found!');

    const comments = await this.getAllCommentByTask(task.id);

    return {
      ...task,
      comments,
    };
  }

  public async createTask(
    input: CreateTaskRequest,
    user: User,
  ): Promise<GetTaskResponse> {
    const teamUsers = await this.mapTeamUsers([...input.teamUsers]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user;
    const status = await this.sectionService.getSection(input.statusId);
    const priority = await this.priorityService.getPriority(input.priorityId);
    const type = await this.typeService.getType(input.typeId);
    const project = await this.projectService.getProjectDetail(input.projectId);

    const result = await this.taskRepository.save({
      ...input,
      teamUsers,
      status,
      priority,
      type,
      createdBy: info,
    });
    const time: GetTimeResponse = {
      originalTime: result.originalTime,
      estimateTime: result.estimateTime,
    };

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      status,
      priority,
      type,
      time,
      teamUsers,
      comments: [],
      projectId: project.id,
      createdBy: result.createdBy,
    };
  }

  public async updateTask(
    task: GetTaskResponse,
    input: CreateTaskRequest,
    user: User,
  ): Promise<GetTaskResponse> {
    const teamUsers = await this.mapTeamUsers([...input.teamUsers]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user;
    const status = await this.sectionService.getSection(input.statusId);
    const priority = await this.priorityService.getPriority(input.priorityId);
    const type = await this.typeService.getType(input.typeId);
    const project = await this.projectService.getProjectDetail(input.projectId);
    const comments = await this.getAllCommentByTask(task.id);
    const result = await this.taskRepository.save({
      ...task,
      ...input,
      teamUsers,
      status,
      priority,
      type,
      createdBy: info,
    });
    const time: GetTimeResponse = {
      originalTime: result.originalTime,
      estimateTime: result.estimateTime,
    };

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      status,
      priority,
      type,
      time,
      teamUsers,
      projectId: project.id,
      comments,
      createdBy: result.createdBy,
    };
  }

  public async assignMemberToTask(
    memberId: AssignUserProjectRequest,
    task: GetTaskResponse,
    user: User,
  ): Promise<GetTaskResponse> {
    const member = await this.userService.getUser(memberId.userId);
    const comments = await this.getAllCommentByTask(task.id);
    const updatedTeamUsers = await this.updateTeamUser(task, member);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user;
    return await this.taskRepository.save({
      ...task,
      teamUsers: updatedTeamUsers,
      comments,
      createdBy: info,
    });
  }

  public async removeMemberToTask(
    memberId: AssignUserProjectRequest,
    task: GetTaskResponse,
    user: User,
  ): Promise<GetTaskResponse> {
    const member = await this.userService.getUser(memberId.userId);
    const comments = await this.getAllCommentByTask(task.id);
    const updatedTeamUsers = await this.updateTeamUser(task, member, 'remove');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user;
    return await this.taskRepository.save({
      ...task,
      teamUsers: updatedTeamUsers,
      comments,
      createdBy: info,
    });
  }

  public async deleteTask(id: string): Promise<DeleteResult> {
    return await this.taskRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
