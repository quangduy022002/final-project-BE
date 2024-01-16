import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SectionService } from '../section.service';
import { ApiParam } from '@nestjs/swagger';
import { CreateSectionRequest } from '../dtos/create.section.dto';

@Controller('/sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get('getAll')
  async findAll() {
    return this.sectionService.getAllSections();
  }

  @Post('create')
  async create(@Body() input: CreateSectionRequest) {
    return await this.sectionService.createSection(input);
  }

  @Patch('update/:id')
  @ApiParam({
    name: 'id',
  })
  async update(@Param('id') id, @Body() input: CreateSectionRequest) {
    const section = await this.sectionService.getSection(id);

    if (!section) {
      throw new NotFoundException();
    }

    return await this.sectionService.updateSection(section, input);
  }

  @Delete('remove/:id')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(204)
  async remove(@Param('id') id) {
    const section = await this.sectionService.getSection(id);

    if (!section) {
      throw new NotFoundException();
    }

    return await this.sectionService.deleteSection(id);
  }
}
