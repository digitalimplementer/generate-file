import { Service } from 'src/services/entities/service.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ default: null })
  icon: string;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
