import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Priority } from './entity/priority.entity';
import { PriorityService } from './priority.service';
import { PriorityController } from './controller/priority.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Priority])],
  providers: [PriorityService],
  controllers: [PriorityController],
})
export class PriorityModule {}
