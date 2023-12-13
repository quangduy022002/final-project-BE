import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CurrentUser } from '../current-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { AuthGuardLocal } from '../auth-guard.local';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dtos/create.user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = new User();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException([
        'Re-password is not the same as password!',
      ]);
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new BadRequestException(['Username or Email is existed!']);
    }

    user.username = createUserDto.username;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
