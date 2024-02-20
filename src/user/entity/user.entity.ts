import { Comment } from 'src/comment/entity/comment.entity';
import { Project } from 'src/project/entity/project.entity';
import { Task } from 'src/task/entity/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'longtext', nullable: true })
  avatar?: string;

  //date of birth
  @Column({ nullable: true })
  dob?: Date;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => Project, (project) => project.createdBy, { cascade: true })
  ownerProject?: Project[];

  @OneToMany(() => Comment, (comment) => comment.createdBy, { cascade: true })
  comments?: Comment[];

  @OneToMany(() => Task, (task) => task.createdBy, { cascade: true })
  ownerTask?: Task[];
}
