import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { ExportFilesService } from 'src/export-files/export-files.service';
import { errorResponses } from 'src/helpers/responses';
import { Between, In, Like, Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServiceDto } from './dtos/create-service.dto';
import { QueryDto } from './dtos/query.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { Service } from './entities/service.entity';

import { EServiceMode, EServiceType } from './types/service.types';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly categoryService: CategoriesService,
    private readonly exportFileService: ExportFilesService,
  ) {}

  async findAll(query: QueryDto) {
    const where: any = {};

    if (query.keyword) {
      where.title = Like('%' + query.keyword + '%');
    }

    if (query.type) {
      where.type = EServiceType[query.type];
    }

    if (query.mode) {
      where.mode = EServiceMode[query.mode];
    }

    const items = await this.serviceRepository.find({
      relations: {
        category: true,
      },
      select: {
        category: {
          id: true,
          title: true,
        },
      },
      where,
      order: {
        id: 'DESC',
      },
    });

    const result = {};
    const categories = await this.categoryService.findAll();

    for (const category of categories) {
      for (const item of items) {
        const categoryId = category.id;
        if (!result[categoryId]) {
          result[categoryId] = {
            id: categoryId,
            title: category.title,
            items: [],
          };
        }

        if (categoryId === item.category.id) {
          const itemWithoutCategory = { ...item };
          delete itemWithoutCategory.category;
          result[categoryId].items.push(itemWithoutCategory);
        }
      }
    }

    return Object.values(result);
  }

  async byId(id: number) {
    const foundService = await this.serviceRepository.findOne({
      relations: { category: true },
      select: {
        category: {
          id: true,
          title: true,
        },
      },
      where: { id: id },
    });

    if (!foundService) {
      throw new BadRequestException(errorResponses.serviceNotFound);
    }
    return foundService;
  }

  async create(data: CreateServiceDto): Promise<Service> {
    return await this.serviceRepository.save({
      ...data,
      category: ({ id: data.categoryId } as Category) || null,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  async update(id: number, data: UpdateServiceDto): Promise<Service> {
    const foundService = await this.byId(id);

    foundService.updated_at = new Date();
    if (data.categoryId) {
      foundService.category = { id: data.categoryId } as Category;
    }

    const updatedService = Object.assign(foundService, data);
    await this.serviceRepository.save(updatedService);

    return updatedService;
  }

  async remove(id: number) {
    await this.byId(id);

    return this.serviceRepository.delete(id);
  }

  async generateFile(data) {
    const where: any = {};

    if (data.mode) {
      where.mode = EServiceMode[String(data.mode)];
    }

    if (data.type) {
      where.type = EServiceType[String(data.type)];
    }

    const res = await this.serviceRepository.find({
      where: {
        ...where,
        created_at: Between(data.fromDate, data.toDate),
      },
    });

    return res;
  }
}
