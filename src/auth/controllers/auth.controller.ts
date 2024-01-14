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
import { LoginUserDto } from 'src/user/dtos/login.user.dto';
import { EmailUserDto } from 'src/user/dtos/email.user.dto';
import { CodeAuthDto } from '../dtos/code.auth.dto';
import { PasswordUserDto } from 'src/user/dtos/password.user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@CurrentUser() user: User, @Body() loginUserDto: LoginUserDto) {
    return {
      user: user,
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

  @Post('sendCode')
  async sendCodeResetPassword(@Body() payload: EmailUserDto) {
    return await this.authService.sendCodeResetPassword(payload.email);
  }

  @Post('checkCode')
  async checkCode(@Body() payload: CodeAuthDto) {
    return await this.authService.checkCode(payload.code);
  }

  @Post('resetPassword')
  async resetPassword(@Body() { password, rePassword }: PasswordUserDto) {
    if (password !== rePassword)
      throw new BadRequestException(['Re-password is not same !']);

    const hashPass = await this.authService.hashPassword(password);

    return this.authService.resetPassword(hashPass);
  }
}
