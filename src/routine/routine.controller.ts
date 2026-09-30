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
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './create-routine.dto';
import {
  CreateRoutineActivityDto,
  UpdateRoutineActivityDto,
} from './routine-activity.dto';

@Controller('routine')
// @UseGuards(AuthGuard('jwt'))
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routineService.create(createRoutineDto);
  }

  @Get('infant/:infantId')
  findByInfant(@Param('infantId', ParseUUIDPipe) infantId: string) {
    console.log('infantId', infantId);
    return this.routineService.findByInfant(infantId);
  }

  @Get('infant/:infantId/grouped')
  findGroupedByInfant(@Param('infantId', ParseUUIDPipe) infantId: string) {
    return this.routineService.findGroupedByInfant(infantId);
  }

  // @Get(':id')
  // findOne(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @GetUser('id') userId: string,
  // ) {
  //   return this.routineService.findOne(id, userId);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @GetUser('id') userId: string,
  // ) {
  //   return this.routineService.remove(id, userId);
  // }

  @Post(':routineId/activities')
  addActivity(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Body() dto: CreateRoutineActivityDto,
  ) {
    return this.routineService.addActivity(routineId, dto);
  }

  @Patch(':routineId/activities/:activityId')
  updateActivity(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Param('activityId', ParseUUIDPipe) activityId: string,
    @Body() dto: UpdateRoutineActivityDto,
  ) {
    return this.routineService.updateActivity(routineId, activityId, dto);
  }

  @Get(':routineId')
  findByRoutineId(@Param('routineId', ParseUUIDPipe) routineId: string) {
    return this.routineService.findByRoutineId(routineId);
  }

  @Delete(':routineId/activities/:activityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeActivity(
    @Param('routineId', ParseUUIDPipe) routineId: string,
    @Param('activityId', ParseUUIDPipe) activityId: string,
  ) {
    return this.routineService.removeActivity(routineId, activityId);
  }
}
