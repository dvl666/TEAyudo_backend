import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async findOne(id: string): Promise<Category | null> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }
}
