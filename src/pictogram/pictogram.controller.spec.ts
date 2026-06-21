import { Test, TestingModule } from '@nestjs/testing';
import { PictogramController } from './pictogram.controller';
import { PictogramService } from './pictogram.service';

describe('PictogramController', () => {
  let controller: PictogramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PictogramController],
      providers: [PictogramService],
    }).compile();

    controller = module.get<PictogramController>(PictogramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
