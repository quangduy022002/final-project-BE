import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SectionModule } from './section/section.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { PriorityModule } from './priority/priority.module';
import { CommentModule } from './comment/comment.module';
import { TypeModule } from './type/type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    AuthModule,
    SectionModule,
    UserModule,
    ProjectModule,
    CommentModule,
    TaskModule,
    PriorityModule,
    TypeModule,
    // CommunityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
