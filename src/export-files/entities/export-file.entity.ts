import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'export_files' })
export class ExportFile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: null })
  filename: string;

  @Column({ default: new Date() })
  fromDate: Date;

  @Column({ default: new Date() })
  toDate: Date;

  @Column({ default: null })
  export_by: string;

  @Column({ default: null })
  format: string;

  @Column({ default: null })
  created_at: Date;
}
