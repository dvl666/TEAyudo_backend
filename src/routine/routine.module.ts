import { Module } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';
import { Routine } from './entities/routine.entity';
import { RoutineActivity } from './entities/routine-activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfantModule } from 'src/infant/infant.module';
import { PictogramModule } from 'src/pictogram/pictogram.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Routine, RoutineActivity]),
    InfantModule,
    PictogramModule,
    StorageModule,
  ],
  controllers: [RoutineController],
  providers: [RoutineService],
})
export class RoutineModule {}
