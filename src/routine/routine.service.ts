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

  async updateActivity(
    routineId: string,
    activityId: string,
    dto: UpdateRoutineActivityDto,
  ) {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId, routine: { id: routineId } },
      relations: { pictogram: true },
    });
    if (!activity) {
      throw new NotFoundException('La actividad no existe en esta rutina');
    }

    if (dto.pictogramId !== undefined) {
      await this.pictogramService.findOne(dto.pictogramId);
    }
    const pictogramId = dto.pictogramId ?? activity.pictogram.id;
    // Guardar solo la referencia al pictograma, no su URL firmada.
    const updated = await this.activityRepository.save({
      id: activity.id,
      name: dto.name !== undefined ? dto.name.trim() : activity.name,
      stage: dto.stage ?? activity.stage,
      position: dto.position ?? activity.position,
      pictogram: { id: pictogramId },
    });
    return {
      id: updated.id,
      routineId,
      name: updated.name,
      stage: updated.stage,
      position: updated.position,
      pictogramId,
    };
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
      relations: {
        activities: {
          pictogram: true,
        },
      },
      order: {
        activities: { position: 'ASC', id: 'ASC' },
      },
    });

    if (!routine) throw new NotFoundException('La rutina no existe');
    return routine;
  }
}
