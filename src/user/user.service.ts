import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserResponse } from './dtos/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private getUsersBaseQuery() {
    return this.userRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public async getAllUsers(): Promise<CreateUserResponse[]> {
    const userList = await this.getUsersBaseQuery().getMany();
    return userList.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    });
  }

  public async getUser(id: string): Promise<CreateUserResponse | undefined> {
    const user = await this.getUsersBaseQuery()
      .andWhere('e.id = :id', { id })
      .getOne();

    if (!user) {
      throw new BadRequestException('User not found!');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  public async getUserByEmail(
    email: string,
  ): Promise<CreateUserResponse | undefined> {
    const user = await this.getUsersBaseQuery()
      .andWhere('e.email = :email', {
        email,
      })
      .getOne();

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
