import { Comment } from 'src/comment/entity/comment.entity';
import { Project } from 'src/project/entity/project.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Project, (project) => project.createdBy)
  ownerProject: Project[];

  @OneToMany(() => Comment, (comment) => comment.createdBy)
  comments: Comment[];
}
