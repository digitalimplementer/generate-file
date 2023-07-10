import { errorResponses } from 'src/helpers/responses';
import { removeImage, saveImage } from 'src/helpers/storing-images';
import { Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { IconDto } from './dtos/icon.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async byId(categoryId: number): Promise<Category> {
    const foundCategory = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!foundCategory) {
      throw new BadRequestException(errorResponses.categoryNotFound);
    }

    return foundCategory;
  }

  async create(data: CreateCategoryDto, icon: IconDto): Promise<Category> {
    try {
      let newImageFilename: string = null;
      if (icon) {
        newImageFilename = saveImage(icon);
      }

      return await this.categoryRepository.save({
        title: data.title,
        icon: newImageFilename,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, data: UpdateCategoryDto, icon: IconDto) {
    let newImageFilename: string | null = null;

    const foundCategory = await this.byId(id);

    if (icon) {
      await removeImage(foundCategory.icon);

      delete foundCategory.icon;
      newImageFilename = await saveImage(icon);
    }

    const updatedCategory = {
      id,
      icon: newImageFilename !== null ? newImageFilename : foundCategory.icon,
      ...data,
      updated_at: new Date(),
    };

    await this.categoryRepository.update({ id }, updatedCategory);

    return updatedCategory;
  }

  async delete(id: number): Promise<number> {
    const foundCategory = await this.byId(id);

    if (foundCategory.icon !== null) {
      removeImage(foundCategory.icon);
    }

    await this.categoryRepository.delete(id);
    return foundCategory.id;
  }
}
