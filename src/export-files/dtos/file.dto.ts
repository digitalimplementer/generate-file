import { Order } from 'src/orders/entities/order.entity';

export class FileDto {
  filename: string;
  fromDate: Date;
  toDate: Date;
  export_by: string;
  format: string;
  result: Order[];
}
