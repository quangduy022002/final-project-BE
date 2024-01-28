import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskRequest, GetTaskResponse } from './dtos/create.task.dto';
import { User } from 'src/user/entity/user.entity';
import { GetUserResponse } from 'src/user/dtos/create.user.dto';
import { UserService } from 'src/user/user.service';
import { SectionService } from 'src/section/section.service';
import { PriorityService } from 'src/priority/priority.service';
import { TypeService } from 'src/type/type.service';
import { GetTimeResponse } from 'src/time/dtos/create.time.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly sectionService: SectionService,
    private readonly priorityService: PriorityService,
    private readonly typeService: TypeService,
  ) {}

  private getTasksBaseQuery() {
    return this.taskRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
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
    console.log(task, 'task detail');
    return;
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
      createdBy: result.createdBy,
    };
  }
}
