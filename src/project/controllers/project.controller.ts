import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../project.service';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { CreateProjectRequest } from '../dtos/create.project.dto';
import { AssignUserProjectRequest } from '../dtos/assign.user.project.dto';
import {
  InviteUserProjectRequest,
  InviteUserProjectResponse,
} from '../dtos/invite.user.project.dto';

@Controller('/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('getAll')
  async findAll() {
    return this.projectService.getAllProjects();
  }

  @Get('projectDetail/:id')
  @ApiParam({
    name: 'id',
  })
  async getOne(@Param('id') id) {
    return await this.projectService.getProjectDetail(id);
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateProjectRequest, @CurrentUser() user: User) {
    return await this.projectService.createProject(input, user);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async update(
    @Param('id') id,
    @Body() input: CreateProjectRequest,
    @CurrentUser() user: User,
  ) {
    const project = await this.projectService.getProjectDetail(id);

    if (!project) {
      throw new NotFoundException();
    }

    return await this.projectService.updateProject(project, input, user);
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async remove(@Param('id') id) {
    const project = await this.projectService.getProjectDetail(id);

    if (!project) {
      throw new NotFoundException();
    }

    return await this.projectService.deleteProject(id);
  }

  @Post('assignMemberToProject/:id')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async assignMemberProject(
    @Param('id') id,
    @Body() memberId: AssignUserProjectRequest,
    @CurrentUser() user: User,
  ) {
    const project = await this.projectService.getProjectDetail(id);

    if (!project) {
      throw new NotFoundException();
    }

    return await this.projectService.assignMemberToProject(
      memberId,
      project,
      user,
    );
  }

  @Post('sendInviteUser')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  async inviteUser(
    @Body() payload: InviteUserProjectRequest,
  ): Promise<boolean> {
    return await this.projectService.inviteUser(payload);
  }

  @Post('acceptInvite')
  async acceptInvite(
    @Body() payload: InviteUserProjectRequest,
  ): Promise<InviteUserProjectResponse> {
    return await this.projectService.acceptInvite(payload);
  }
}
