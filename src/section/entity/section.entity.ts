import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  title: string;

  // tasks:
}
