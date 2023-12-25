import { Section } from 'src/section/entity/section.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column('simple-array')
  sections: Section[];

  @Column('simple-array')
  teamUsers: User[];

  @ManyToOne(() => User, (user) => user.id)
  createdBy?: User;
}
