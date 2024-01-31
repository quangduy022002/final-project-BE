import { Task } from 'src/task/entity/task.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @ManyToOne(() => Task, (task) => task.id)
  @Column()
  taskId: string;
}
