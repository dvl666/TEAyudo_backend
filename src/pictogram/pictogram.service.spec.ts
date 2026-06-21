import { Test, TestingModule } from '@nestjs/testing';
import { PictogramService } from './pictogram.service';

describe('PictogramService', () => {
  let service: PictogramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PictogramService],
    }).compile();

    service = module.get<PictogramService>(PictogramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
