import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'export_files' })
export class ExportFile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: null })
  filename: string;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @Column({ default: null })
  export_by: string;

  @Column({ default: null })
  format: string;

  @Column()
  created_at: Date;
}
