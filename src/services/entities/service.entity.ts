import { Category } from 'src/categories/entities/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { EServiceMode, EServiceType } from '../types/service.types';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ default: null, type: 'text' })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'enum', enum: EServiceMode, default: EServiceMode.AUTO })
  mode: EServiceMode;

  @Column({ type: 'enum', enum: EServiceType, default: EServiceType.DEFAULT })
  type: EServiceType;

  @Column({ default: 0 })
  min_order: number;

  @Column({ default: 0 })
  max_order: number;

  @ManyToOne(() => Category)
  @JoinColumn()
  category: Category;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
