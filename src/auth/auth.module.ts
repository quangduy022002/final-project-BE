import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { User } from 'src/user/entity/user.entity';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { MediaService } from 'src/media/media.service';
import { FirebaseService } from 'src/firebase/firebase.image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    UserService,
    MediaService,
    FirebaseService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
