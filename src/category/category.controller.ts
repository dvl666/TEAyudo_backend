import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth( ValidRoles.USER )
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Auth( ValidRoles.USER )
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<Category | null> {
    console.log(`Fetching category with ID: ${id}`);
    return this.categoryService.findOne(id);
  }

  @Auth( ValidRoles.ADMIN )
  @Post()
  create(@Body() categoryData: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(categoryData);
  }

  @Auth( ValidRoles.ADMIN )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

}
