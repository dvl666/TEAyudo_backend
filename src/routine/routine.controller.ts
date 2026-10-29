import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './create-routine.dto';
import {
  CreateRoutineActivityDto,
  UpdateRoutineActivityDto,
} from './routine-activity.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { Authorization } from 'src/authorization/decorators/authorization/authorization.decorator';
import { AccessType } from 'src/authorization/interfaces/access-type.interface';

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Auth( ValidRoles.USER )
  @Post()
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routineService.create(createRoutineDto);
  }

  @Authorization( AccessType.INFANT )
  @Auth( ValidRoles.USER )
  @Get('infant/:infantId')
  findByInfant(@Param('infantId', ParseUUIDPipe) infantId: string) {
    console.log('infantId', infantId);
    return this.routineService.findByInfant(infantId);
  }

  @Authorization( AccessType.INFANT )
  @Auth( ValidRoles.USER )
  @Get('infant/:infantId/grouped')
  findGroupedByInfant(@Param('infantId', ParseUUIDPipe) infantId: string) {
    return this.routineService.findGroupedByInfant(infantId);
  }

  @Auth( ValidRoles.USER )
  @Post(':routineId/activities')
  addActivity(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Body() dto: CreateRoutineActivityDto,
  ) {
    return this.routineService.addActivity(routineId, dto);
  }

  @Auth( ValidRoles.USER )
  @Patch(':routineId/activities/:activityId')
  updateActivity(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Param('activityId', ParseUUIDPipe) activityId: string,
    @Body() dto: UpdateRoutineActivityDto,
  ) {
    return this.routineService.updateActivity(routineId, activityId, dto);
  }

  @Auth( ValidRoles.USER )
  @Get(':routineId')
  findByRoutineId(@Param('routineId', ParseUUIDPipe) routineId: string) {
    return this.routineService.findByRoutineId(routineId);
  }

  @Auth( ValidRoles.USER )
  @Delete(':routineId/activities/:activityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeActivity(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Param('activityId', ParseUUIDPipe) activityId: string,
  ) {
    return this.routineService.removeActivity(routineId, activityId);
  }
}
