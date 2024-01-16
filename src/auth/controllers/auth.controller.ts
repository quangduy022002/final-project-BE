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
import { CodeAuthRequest } from '../dtos/code.auth.dto';
import { LoginUserRequest } from 'src/user/dtos/login.user.dto';
import { CreateUserRequest } from 'src/user/dtos/create.user.dto';
import { EmailUserRequest } from 'src/user/dtos/email.user.dto';
import { PasswordUserRequest } from 'src/user/dtos/password.user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(
    @CurrentUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() loginUserRequest: LoginUserRequest,
  ) {
    return {
      user: user,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Post('createUser')
  async createUser(@Body() createUserRequest: CreateUserRequest) {
    const user = new User();

    if (createUserRequest.password !== createUserRequest.retypedPassword) {
      throw new BadRequestException([
        'Re-password is not the same as password!',
      ]);
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserRequest.username },
        { email: createUserRequest.email },
      ],
    });

    if (existingUser) {
      throw new BadRequestException(['Username or Email is existed!']);
    }

    user.username = createUserRequest.username;
    user.password = await this.authService.hashPassword(
      createUserRequest.password,
    );
    user.email = createUserRequest.email;
    user.firstName = createUserRequest.firstName;
    user.lastName = createUserRequest.lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }

  @Post('sendCode')
  async sendCodeResetPassword(@Body() payload: EmailUserRequest) {
    return await this.authService.sendCodeResetPassword(payload.email);
  }

  @Post('checkCode')
  async checkCode(@Body() payload: CodeAuthRequest) {
    return await this.authService.checkCode(payload.code);
  }

  @Post('resetPassword')
  async resetPassword(@Body() { password, rePassword }: PasswordUserRequest) {
    if (password !== rePassword)
      throw new BadRequestException(['Re-password is not same !']);

    const hashPass = await this.authService.hashPassword(password);

    return this.authService.resetPassword(hashPass);
  }
}
