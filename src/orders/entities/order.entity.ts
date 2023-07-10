import { Service } from 'src/services/entities/service.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EOrderMode, EOrderStatus } from '../types/order.types';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'numeric', precision: 30, scale: 10 })
  charge: number;

  @Column()
  link: string;

  @Column({ default: 0 })
  start_count: number;

  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => Service)
  service: Service;

  @Column({ default: EOrderStatus.AWAITING })
  status: EOrderStatus;

  @Column({ default: 0 })
  remains: number;

  @Column({ default: EOrderMode.AUTO })
  @Index()
  mode: EOrderMode;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  cost: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
