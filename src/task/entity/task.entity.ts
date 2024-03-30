import { Comment } from 'src/comment/entity/comment.entity';
import { Priority } from 'src/priority/entity/priority.entity';
import { Project } from 'src/project/entity/project.entity';
import { Section } from 'src/section/entity/section.entity';
import { Type } from 'src/type/entity/type.entity';
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
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  status: Section;

  @Column({ type: 'json', nullable: true })
  priority: Priority;

  @Column({ type: 'json', nullable: true })
  type: Type;

  @Column({ type: 'json', nullable: true })
  time: object;

  @Column({ nullable: true })
  deadline: string;

  @Column({ type: 'json', nullable: true })
  teamUsers: User[];

  @OneToMany(() => Comment, (cmt) => cmt.task)
  comments: Comment[] | null;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project' })
  project: Project;

  @ManyToOne(() => User, (user) => user.ownerTask, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy?: User;
}
