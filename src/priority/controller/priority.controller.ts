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
import { PriorityService } from '../priority.service';
import { CreatePriorityRequest } from '../dtos/create.priority.dto';
import { Priority } from '../entity/priority.entity';
import { ApiParam } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@Controller('/priorities')
export class PriorityController {
  constructor(private readonly priorityService: PriorityService) {}

  @Get('getAll')
  async findAll(): Promise<Priority[]> {
    return await this.priorityService.getAllPriorities();
  }

  @Post('create')
  async create(@Body() input: CreatePriorityRequest): Promise<Priority> {
    return await this.priorityService.createPriority(input);
  }

  @Patch('update/:id')
  @ApiParam({
    name: 'id',
  })
  async update(
    @Param('id') id,
    @Body() input: CreatePriorityRequest,
  ): Promise<Priority> {
    const priority = await this.priorityService.getPriority(id);

    if (!priority) {
      throw new NotFoundException();
    }

    return await this.priorityService.updatePriority(priority, input);
  }

  @Delete('remove/:id')
  @ApiParam({
    name: 'id',
  })
  @HttpCode(204)
  async remove(@Param('id') id): Promise<DeleteResult> {
    const priority = await this.priorityService.getPriority(id);

    if (!priority) {
      throw new NotFoundException();
    }

    return await this.priorityService.deletePriority(id);
  }
}
