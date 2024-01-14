import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private getUsersBaseQuery() {
    return this.userRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public async getAllUsers() {
    return await this.getUsersBaseQuery().getMany();
  }

  public async getUser(id: string): Promise<User | undefined> {
    const query = await this.getUsersBaseQuery().andWhere('e.id = :id', { id });

    return query.getOne();
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    const query = await this.getUsersBaseQuery().andWhere('e.email = :email', {
      email,
    });

    return query.getOne();
  }
}
