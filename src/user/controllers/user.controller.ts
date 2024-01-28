import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user.service';
import { ApiParam } from '@nestjs/swagger';
import { GetUserResponse } from '../dtos/create.user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAll')
  async findAll(): Promise<GetUserResponse[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  async getUserDetail(@Param('id') id): Promise<GetUserResponse> {
    return await this.userService.getUser(id);
  }
}
