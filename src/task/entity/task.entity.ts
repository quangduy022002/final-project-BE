import { Comment } from 'src/comment/entity/comment.entity';
import { Priority } from 'src/priority/entity/priority.entity';
import { Section } from 'src/section/entity/section.entity';
import { Time } from 'src/time/entity/time.entity';
import { Type } from 'src/type/entity/type.entity';
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
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'json', nullable: true })
  status: Section;

  @Column({ type: 'json', nullable: true })
  priority: Priority;

  @Column({ type: 'json', nullable: true })
  type: Type;

  @Column({ type: 'json', nullable: true })
  time: Time;

  @Column({ type: 'json', nullable: true })
  teamUsers: User[];

  @Column({ type: 'json', nullable: true })
  @OneToMany(() => Comment, (cmt) => cmt.belongTo)
  comments: Comment[] | null;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: User;
}
