import { Test, TestingModule } from '@nestjs/testing';
import { PhrasePictogramService } from './phrase-pictogram.service';

describe('PhrasePictogramService', () => {
  let service: PhrasePictogramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhrasePictogramService],
    }).compile();

    service = module.get<PhrasePictogramService>(PhrasePictogramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
