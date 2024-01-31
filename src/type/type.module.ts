import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from './entity/type.entity';
import { TypeService } from './type.service';
import { TypeController } from './controller/type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Type])],
  providers: [TypeService],
  controllers: [TypeController],
})
export class TypeModule {}
