import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Project } from './entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { SectionService } from 'src/section/section.service';
import { Section } from 'src/section/entity/section.entity';
import { CreateProjectRequest } from './dtos/create.project.dto';
import { AssignUserProjectRequest } from './dtos/assign.user.project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly sectionService: SectionService,
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

  public async getProjectDetail(id: number): Promise<Project> {
    const query = await this.getProjectsBaseQuery().andWhere('e.id = :id', {
      id,
    });
    const project = await query.getOne();
    if (project) {
      const sectionsPromises: Promise<Section>[] = project.sections.map(
        async (section: Section) => {
          return await this.sectionService.getSection(section.id);
        },
      );
      const sections: Section[] = await Promise.all(sectionsPromises);
      return { ...project, sections };
    } else {
      throw new NotFoundException();
    }
  }

  public async createProject(
    input: CreateProjectRequest,
    user: User,
  ): Promise<Project> {
    const sectionsPromises: Promise<Section>[] = input.sections.map(
      async (sectionId: number) => {
        return await this.sectionService.getSection(sectionId);
      },
    );
    const sections: Section[] = await Promise.all(sectionsPromises);

    return await this.projectRepository.save({
      ...input,
      sections,
      createdBy: user.id,
    });
  }

  public async updateProject(
    project: Project,
    input: CreateProjectRequest,
    user: User,
  ): Promise<Project> {
    const sectionsPromises: Promise<Section>[] = input.sections.map(
      async (sectionId: number) => {
        return await this.sectionService.getSection(sectionId);
      },
    );
    const sections: Section[] = await Promise.all(sectionsPromises);
    return await this.projectRepository.save({
      ...project,
      ...input,
      sections,
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
    memberId: AssignUserProjectRequest,
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
    const sectionsPromises: Promise<Section>[] = project.sections.map(
      async (section: Section) => {
        return await this.sectionService.getSection(section.id);
      },
    );
    const sections: Section[] = await Promise.all(sectionsPromises);
    return await this.projectRepository.save({
      ...project,
      sections,
      teamUsers: updatedTeamUsers,
      createdBy: user.id,
    });
  }
}
