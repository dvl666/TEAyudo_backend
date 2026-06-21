import { Test, TestingModule } from '@nestjs/testing';
import { GameProgressController } from './game-progress.controller';
import { GameProgressService } from './game-progress.service';

describe('GameProgressController', () => {
  let controller: GameProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameProgressController],
      providers: [GameProgressService],
    }).compile();

    controller = module.get<GameProgressController>(GameProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
