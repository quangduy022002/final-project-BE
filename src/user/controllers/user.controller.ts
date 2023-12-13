import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UserController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}
