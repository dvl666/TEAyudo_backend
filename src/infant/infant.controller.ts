import { Body, Controller, Get, Post } from '@nestjs/common';
import { InfantService } from './infant.service';
import { Infant } from './entities/infant.entity';
import { CreateInfantDto } from './dtos/create-infant.dto';

@Controller('infant')
export class InfantController {
  constructor(
    private readonly infantService: InfantService
  ) {}

  @Get()
  findAll(): Promise<Infant[]> {
    return this.infantService.findAll();
  }

  @Post()
  create(@Body() createInfantDto: CreateInfantDto): Promise<Infant> {
    console.log('Received CreateInfantDto:', createInfantDto);
    return this.infantService.create(createInfantDto);
  }
}
