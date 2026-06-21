import { Test, TestingModule } from '@nestjs/testing';
import { PhrasePictogramController } from './phrase-pictogram.controller';
import { PhrasePictogramService } from './phrase-pictogram.service';

describe('PhrasePictogramController', () => {
  let controller: PhrasePictogramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhrasePictogramController],
      providers: [PhrasePictogramService],
    }).compile();

    controller = module.get<PhrasePictogramController>(PhrasePictogramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
