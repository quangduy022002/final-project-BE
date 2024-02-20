import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { MediaService } from 'src/media/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, MediaService],
  controllers: [UserController],
})
export class UserModule {}
