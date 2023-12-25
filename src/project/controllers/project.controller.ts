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
import { CreateProjectDto } from '../dtos/create.project.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entity/user.entity';

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
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  async create(@Body() input: CreateProjectDto, @CurrentUser() user: User) {
    console.log(user);
    return await this.projectService.createProject(input, user);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async update(@Param('id') id, @Body() input: CreateProjectDto) {
    const project = await this.projectService.getProjectDetail(id);

    if (!project) {
      throw new NotFoundException();
    }

    return await this.projectService.updateProject(project, input);
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
}
