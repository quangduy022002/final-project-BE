import { Section } from 'src/section/entity/section.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ type: 'json', nullable: true })
  sections: Section[] | null;

  @Column('simple-array')
  teamUsers: string[];

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: User;
}
