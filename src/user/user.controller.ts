import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { Authorization } from 'src/authorization/decorators/authorization/authorization.decorator';
import { AccessType } from 'src/authorization/interfaces/access-type.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth( ValidRoles.ADMIN )
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Authorization( AccessType.SELF )
  @Auth( ValidRoles.USER )
  @Get(':tutorId')
  findOne(
    @Param('tutorId') tutorId: string,
  ): Promise<User | null> {
    return this.userService.findOne(tutorId);
  }

  @Post('/register')
  create(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }

  @Authorization( AccessType.SELF )
  @Auth( ValidRoles.USER )
  @Get(':tutorId/infants')
  findOneUserWithInfants(
    @Param('tutorId') tutorId: string,
  ): Promise<User | null> {
    return this.userService.findOneUserWithInfants(tutorId);
  }

  @Authorization( AccessType.SELF )
  @Auth( ValidRoles.USER )
  @Post(':tutorId/validate-pin')
  validateAdministrativePin( @Param('tutorId') tutorId: string, @Body('pin') pin: string ): Promise<boolean> {
    return this.userService.validateAdministrativePin(tutorId, pin);
  }
}
