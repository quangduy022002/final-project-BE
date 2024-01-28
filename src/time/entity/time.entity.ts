import { IsNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Time {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  estimateTime: number;

  @Column()
  @IsNumber()
  originalTime: number;
}
