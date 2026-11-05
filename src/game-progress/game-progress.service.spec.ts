import { Test, TestingModule } from '@nestjs/testing';
import { GameProgressService } from './game-progress.service';

describe('GameProgressService', () => {
  let service: GameProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameProgressService],
    }).compile();

    service = module.get<GameProgressService>(GameProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
