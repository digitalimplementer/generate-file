import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  byId(@Param('id') id: number): Promise<Category | null> {
    return this.categoriesService.byId(id);
  }

  @UseInterceptors(FileInterceptor('icon'))
  @Post()
  async create(
    @Body() body: CreateCategoryDto,
    @UploadedFile()
    icon: Express.Multer.File,
  ): Promise<Category> {
    return await this.categoriesService.create(body, icon);
  }

  @UseInterceptors(FileInterceptor('icon'))
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() body: UpdateCategoryDto,
    @UploadedFile()
    icon: Express.Multer.File,
  ) {
    return this.categoriesService.update(id, body, icon);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categoriesService.delete(id);
  }
}
