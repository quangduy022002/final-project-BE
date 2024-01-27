import { Task } from 'src/task/entity/task.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @OneToMany(() => Task, (task) => task.id)
  @JoinColumn({ name: 'belongTo' })
  belongTo: Task;
}
