import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './controllers/project.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
