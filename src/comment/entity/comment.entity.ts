import { Task } from 'src/task/entity/task.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: 'task' })
  task?: Task;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy?: User;

  @ManyToOne(() => Comment, (parent) => parent.children, { nullable: true })
  parent?: Comment | null;

  @OneToMany(() => Comment, (child) => child.parent)
  children?: Comment[];
}
