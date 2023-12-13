import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from 'src/user/entity/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'secret123',
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
