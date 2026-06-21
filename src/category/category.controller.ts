import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<Category | null> {
    console.log(`Fetching category with ID: ${id}`);
    return this.categoryService.findOne(id);
  }

  @Post()
  create(@Body() categoryData: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(categoryData);
  }

}
