import { Section } from 'src/section/entity/section.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column('json', { array: true })
  section: Section[];

  @Column('json', { array: true })
  teamUsers: User[];

  @ManyToMany(() => User, (user) => user.id)
  createBy: User;
}
