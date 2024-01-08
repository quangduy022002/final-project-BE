import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './controllers/project.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  providers: [ProjectService, UserService],
  controllers: [ProjectController],
})
export class ProjectModule {}
