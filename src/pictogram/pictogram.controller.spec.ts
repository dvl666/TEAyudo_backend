import { Test, TestingModule } from '@nestjs/testing';
import { PictogramController } from './pictogram.controller';
import { PictogramService } from './pictogram.service';

describe('PictogramController', () => {
  let controller: PictogramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PictogramController],
      providers: [
        {
          provide: PictogramService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PictogramController>(PictogramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
