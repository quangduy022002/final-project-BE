import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user.service';
import { ApiParam } from '@nestjs/swagger';
import { CreateUserResponse } from '../dtos/create.user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAll')
  async findAll(): Promise<CreateUserResponse[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  async getUserDetail(@Param('id') id): Promise<CreateUserResponse> {
    return await this.userService.getUser(id);
  }
}
