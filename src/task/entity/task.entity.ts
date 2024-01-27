import { Comment } from 'src/comment/entity/comment.entity';
import { Priority } from 'src/priority/entity/priority.entity';
import { Section } from 'src/section/entity/section.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column({ type: 'json', nullable: true })
  status: Section;

  @Column({ type: 'json', nullable: true })
  priority: Priority;

  @Column('simple-array')
  teamUser: string[];

  @Column({ type: 'json', nullable: true })
  @OneToMany(() => Comment, (cmt) => cmt.belongTo)
  comments: Comment[] | null;
}
