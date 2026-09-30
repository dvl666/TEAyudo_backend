import {
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { InfantService } from 'src/infant/infant.service';
import { Routine } from './entities/routine.entity';
import { RoutineActivity } from './entities/routine-activity.entity';
import { StorageService } from 'src/storage/storage.service';
import { RoutineStage } from './enums/routine-stage.enum';
import { CreateRoutineDto } from './create-routine.dto';
import {
  CreateRoutineActivityDto,
  UpdateRoutineActivityDto,
} from './routine-activity.dto';
import { PictogramService } from 'src/pictogram/pictogram.service';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(RoutineActivity)
    private readonly activityRepository: Repository<RoutineActivity>,

    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,

    private readonly infantService: InfantService,

    private readonly pictogramService: PictogramService,
    private readonly storageService: StorageService,
  ) {}

  async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    const { infantId, dayOfWeek } = createRoutineDto;
    const infant = await this.infantService.findOne(infantId);
    const routine = this.routineRepository.create({
      infant,
      dayOfWeek,
      activities: [],
    });

    try {
      return await this.routineRepository.save(routine);
    } catch (error) {
      // La restricción protege también frente a solicitudes simultáneas.
      if (error instanceof QueryFailedError) {
        const databaseError = error.driverError as {
          code?: string;
          constraint?: string;
        };
        if (
          databaseError.code === '23505' &&
          databaseError.constraint === 'UQ_routine_infant_day'
        ) {
          throw new ConflictException(
            'El niño ya tiene una rutina para ese día',
          );
        }
      }
      throw error;
    }
  }

  async findByInfant(infantId: string): Promise<Routine[]> {
    const routines = await this.routineRepository.find({
      where: { infant: { id: infantId } },
      relations: {
        activities: {
          pictogram: true,
        },
      },
      order: {
        dayOfWeek: 'ASC',
        activities: {
          position: 'ASC',
        },
      },
    });

    if (routines.length === 0) {
      throw new NotFoundException('El niño no tiene rutinas');
    }

    return routines;
  }

  async findGroupedByInfant(infantId: string) {
    await this.infantService.findOne(infantId);
    const routines = await this.routineRepository.find({
      where: { infant: { id: infantId } },
      relations: { activities: { pictogram: true } },
      order: { dayOfWeek: 'ASC', activities: { position: 'ASC', id: 'ASC' } },
    });
    const images = new Map<string, Promise<string>>();
    return Promise.all(
      routines.map(async (routine) => {
        const activities = await Promise.all(
          routine.activities.map(async (activity) => {
            const pictogram = activity.pictogram;
            const key = pictogram.pictoImageUrl;
            if (!images.has(key))
              images.set(key, this.storageService.getSignedUrl(key));
            return {
              id: activity.id,
              name: activity.name,
              stage: activity.stage,
              position: activity.position,
              pictogram: {
                id: pictogram.id,
                pictogramName: pictogram.pictogramName,
                description: pictogram.description,
                personal: pictogram.personal,
                pictoImageUrl: await images.get(key)!,
              },
            };
          }),
        );
        const byStage = (stage: RoutineStage) =>
          activities
            .filter((activity) => activity.stage === stage)
            .map(({ id, name, position, pictogram }) => ({
              id,
              name,
              position,
              pictogram,
            }));
        return {
          id: routine.id,
          infantId,
          dayOfWeek: routine.dayOfWeek,
          morning: byStage(RoutineStage.MORNING),
          afternoon: byStage(RoutineStage.AFTERNOON),
          night: byStage(RoutineStage.NIGHT),
        };
      }),
    );
  }

  findOne(_id: string, _userId: string): never {
    throw new NotImplementedException('Routine lookup is not implemented yet');
  }

  remove(_id: string, _userId: string): never {
    throw new NotImplementedException(
      'Routine deletion is not implemented yet',
    );
  }

  async addActivity(
    routineId: string,
    dto: CreateRoutineActivityDto,
  ): Promise<RoutineActivity> {
    const routine = await this.findByRoutineId(routineId);

    const pictogram = await this.pictogramService.findOne(dto.pictogramId);

    const activity = this.activityRepository.create({
      routine,
      pictogram,
      name: dto.name.trim(),
      stage: dto.stage,
      position: dto.position,
    });

    return this.activityRepository.save(activity);
  }

  updateActivity(
    _routineId: string,
    _activityId: string,
    _dto: UpdateRoutineActivityDto,
  ): never {
    throw new NotImplementedException('Activity update is not implemented yet');
  }

  removeActivity(
    _routineId: string,
    _activityId: string,
    _userId: string,
  ): never {
    throw new NotImplementedException(
      'Activity deletion is not implemented yet',
    );
  }

  async findByRoutineId(routineId: string): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId },
    });

    if (!routine) throw new NotFoundException('La rutina no existe');
    return routine;
  }
}
