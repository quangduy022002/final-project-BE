import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAll')
  async findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  async getUserDetail(@Param('id') id) {
    return await this.userService.getUser(id);
  }
}
