import { Test, TestingModule } from '@nestjs/testing';
import { PhraseService } from './phrase.service';

describe('PhraseService', () => {
  let service: PhraseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhraseService],
    }).compile();

    service = module.get<PhraseService>(PhraseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
