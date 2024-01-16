import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateUserResponse } from 'src/user/dtos/create.user.dto';
@Injectable()
export class AuthService {
  private code: number;
  private email: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async sendCodeResetPassword(email: string): Promise<object> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    this.email = user.email;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tambintv1@gmail.com',
        pass: 'vdba tjns zelf koqt',
      },
      port: 587,
      secure: false,
      requireTLS: true,
    });

    this.code = Math.floor(Math.random() * 900000) + 100000;
    const mailOptions = {
      from: 'tambintv1@gmail.com',
      to: email,
      subject: 'Sending new password for user',
      text: 'New message',
      html: `<p style="font-size: '20px'; font-weight: 600">Your code is: ${this.code}</p>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new BadRequestException('Error sending email');
    }
  }

  public checkCode(code: number): boolean {
    if (code !== this.code)
      throw new BadRequestException('The code is not valid !');

    return true;
  }

  public async resetPassword(password: string): Promise<CreateUserResponse> {
    const user = await this.userService.getUserByEmail(this.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const userAfterResetPass = await this.userRepository.save({
      ...user,
      password,
    });

    return {
      id: userAfterResetPass.id,
      username: userAfterResetPass.username,
      email: userAfterResetPass.email,
      firstName: userAfterResetPass.firstName,
      lastName: userAfterResetPass.lastName,
    };
  }
}
