import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Project } from './entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dtos/create.project.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  private getProjectsBaseQuery() {
    return this.projectRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getAllProjects() {
    return await this.getProjectsBaseQuery().getMany();
  }

  public async getProjectDetail(id: number): Promise<Project | undefined> {
    const query = await this.getProjectsBaseQuery().andWhere('e.id = :id', {
      id,
    });

    return await query.getOne();
  }

  public async createProject(
    input: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    return await this.projectRepository.save({
      ...input,
      createdBy: user,
    });
  }

  public async updateProject(
    project: Project,
    input: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    return await this.projectRepository.save({
      ...project,
      ...input,
      createdBy: user,
    });
  }

  public async deleteProject(id: number): Promise<DeleteResult> {
    return await this.projectRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  public async assignMemberToProject(
    assignMember: User,
    project: Project,
    user: User,
  ): Promise<Project> {
    return await this.projectRepository.save({
      ...project,
      createdBy: user,
      teamUsers: [...project.teamUsers, assignMember],
    });
  }
}
