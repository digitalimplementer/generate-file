import { errorResponses } from 'src/helpers/responses';
import { Service } from 'src/services/entities/service.entity';
import { ServicesService } from 'src/services/services.service';
import { Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';

import { EOrderMode, EOrderStatus } from './types/order.types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly service: ServicesService,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async byId(categoryId: number): Promise<Order> {
    const foundCategory = await this.orderRepository.findOne({
      where: { id: categoryId },
    });

    if (!foundCategory) {
      throw new BadRequestException(errorResponses.categoryNotFound);
    }

    return foundCategory;
  }

  async create(data: CreateOrderDto): Promise<Order> {
    try {
      const service = await this.service.byId(data.serviceId);

      if (!service) {
        throw new Error(`Service with ID ${data.serviceId} not found`);
      }

      const newOrder = this.orderRepository.create({
        ...data,
        status: EOrderStatus[data.status],
        mode: EOrderMode[data.mode],
        service: { id: data.serviceId } as Service,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.orderRepository.save(newOrder);
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, data) {
    const updatedCategory = {
      id,
      ...data,
      updated_at: new Date(),
    };

    await this.orderRepository.update({ id }, updatedCategory);

    return updatedCategory;
  }

  async bulkDelete(ids: []) {
    return (
      await this.orderRepository.delete(ids),
      { message: 'Orders were successfully deleted' }
    );
  }

  async delete(id: number): Promise<number> {
    const foundCategory = await this.byId(id);

    await this.orderRepository.delete(id);
    return foundCategory.id;
  }

  async generateFile(data) {
    return;
  }
}
