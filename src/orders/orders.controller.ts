import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  byId(@Param('id') id: number): Promise<Order | null> {
    return this.ordersService.byId(id);
  }

  @Post()
  async create(@Body() body: CreateOrderDto): Promise<Order> {
    return await this.ordersService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() body: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, body);
  }

  @Delete('bulk-delete')
  async bulkDelete(@Body() body) {
    return await this.ordersService.bulkDelete(body.ids);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.ordersService.delete(id);
  }
}
