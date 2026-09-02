import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Infant } from '../infant/entities/infant.entity';
import { StorageService } from '../storage/storage.service';
import { User } from '../user/entities/user.entity';
import { Pictogram } from './entities/pictogram.entity';
import { PictogramService } from './pictogram.service';

describe('PictogramService', () => {
  let service: PictogramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PictogramService,
        ...[Pictogram, Category, User, Infant].map((entity) => ({
          provide: getRepositoryToken(entity),
          useValue: {},
        })),
        { provide: StorageService, useValue: {} },
      ],
    }).compile();

    service = module.get<PictogramService>(PictogramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
