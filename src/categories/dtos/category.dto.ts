import { Service } from 'src/services/entities/service.entity';

export class CategoryDto {
  title: string;
  icon: string;
  services: Service[];
  created_at: Date;
  updated_at: Date;
}
