import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('simple-array')
  sections: number[];

  @Column('simple-array')
  teamUsers: string[];

  @ManyToOne(() => User, (user) => user.id)
  createdBy?: string;
}
