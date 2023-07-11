import { ExportFilesService } from 'src/export-files/export-files.service';
import { validateDate } from 'src/helpers/date-validation';
import { errorResponses } from 'src/helpers/responses';
import { Service } from 'src/services/entities/service.entity';
import { ServicesService } from 'src/services/services.service';
import { In, Repository } from 'typeorm';

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
    private readonly exportFile: ExportFilesService,
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
    validateDate(data.fromDate, data.toDate);

    const where: any = {};
    if (data.statuses && data.statuses.length > 0) {
      where.status = In(
        data.statuses.map(
          (status) => EOrderStatus[status.toUpperCase().trim()],
        ),
      );
    }

    if (data.services && data.services.length > 0) {
      where.service = In(data.services);
    }

    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.service', 'service')
      .select('order.id', 'id')
      .addSelect('order.charge', 'charge')
      .addSelect('order.link', 'link')
      .addSelect('order.start_count', 'start_count')
      .addSelect('order.quantity', 'quantity')
      .addSelect('order.status', 'status')
      .addSelect('order.remains', 'remains')
      .addSelect('order.created_at', 'created')
      .addSelect('order.mode', 'mode')
      .addSelect('service.id', 'service_id')
      .addSelect('service.title', 'service_title')
      .where(where)
      .getRawMany();

    if (result.length <= 0) {
      throw new BadRequestException(errorResponses.dataNotFound);
    }

    const filename = `${+new Date()}.${data.format}`;

    const obj = {
      result,
      filename,
      format: data.format,
      fromDate: data.fromDate,
      toDate: data.toDate,
      export_by: 'orders',
      created_at: new Date(),
    };

    return await this.exportFile.generate(obj);
  }
}
