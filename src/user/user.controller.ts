import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<User | null> {
    console.log(`Fetching user with ID: ${id}`);
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }

  @Get(':id/infants')
  findOneUserWithInfants(
    @Param('id') id: string,
  ): Promise<User | null> {
    return this.userService.findOneUserWithInfants(id);
  }

}
