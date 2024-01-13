import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './controllers/project.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { Section } from 'src/section/entity/section.entity';
import { SectionService } from 'src/section/section.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, Section])],
  providers: [ProjectService, UserService, SectionService],
  controllers: [ProjectController],
})
export class ProjectModule {}
