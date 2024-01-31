import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskController } from './controller/task.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { Section } from 'src/section/entity/section.entity';
import { SectionService } from 'src/section/section.service';
import { TypeService } from 'src/type/type.service';
import { Type } from 'src/type/entity/type.entity';
import { Priority } from 'src/priority/entity/priority.entity';
import { PriorityService } from 'src/priority/priority.service';
import { Project } from 'src/project/entity/project.entity';
import { ProjectService } from 'src/project/project.service';
import { Comment } from 'src/comment/entity/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      User,
      Section,
      Type,
      Priority,
      Project,
      Comment,
    ]),
  ],
  providers: [
    TaskService,
    UserService,
    SectionService,
    TypeService,
    PriorityService,
    ProjectService,
  ],
  controllers: [TaskController],
})
export class TaskModule {}
