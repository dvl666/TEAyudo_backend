import { Test, TestingModule } from '@nestjs/testing';
import { InfantService } from './infant.service';

describe('InfantService', () => {
  let service: InfantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfantService],
    }).compile();

    service = module.get<InfantService>(InfantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
