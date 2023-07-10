import { EServiceMode, EServiceType } from '../types/service.types';

export class CreateServiceDto {
  title: string;
  description: string;
  price: number;
  mode: EServiceMode;
  type: EServiceType;
  min_order: number;
  max_order: number;
  categoryId: number;
}
