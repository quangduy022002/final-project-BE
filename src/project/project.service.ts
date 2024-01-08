import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Project } from './entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dtos/create.project.dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { AssignUserProjectDto } from './dtos/assign.user.project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
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
      createdBy: user.id,
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
      createdBy: user.id,
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
    memberId: AssignUserProjectDto,
    project: Project,
    user: User,
  ): Promise<Project> {
    const member = await this.userService.getUser(memberId.userId);

    const updatedTeamUsers: Array<string> = [...project.teamUsers];
    if (
      !updatedTeamUsers.some(
        (existingMember: string) => existingMember === member.id,
      )
    ) {
      updatedTeamUsers.push(member.id);
    }

    return await this.projectRepository.save({
      ...project,
      teamUsers: updatedTeamUsers,
      createdBy: user.id,
    });
  }
}
