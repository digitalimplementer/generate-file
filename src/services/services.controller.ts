import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateServiceDto } from './dtos/create-service.dto';
import { QueryDto } from './dtos/query.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { Service } from './entities/service.entity';

import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  byId(@Param('id') id: number): Promise<Service> {
    return this.servicesService.byId(id);
  }

  @Post()
  async create(@Body() body: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(body);
  }

  @Post('generate-file')
  async generateFile(@Body() body) {
    return await this.servicesService.generateFile(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.servicesService.remove(id);
  }
}
