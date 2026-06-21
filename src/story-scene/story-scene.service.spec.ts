import { Test, TestingModule } from '@nestjs/testing';
import { StorySceneService } from './story-scene.service';

describe('StorySceneService', () => {
  let service: StorySceneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorySceneService],
    }).compile();

    service = module.get<StorySceneService>(StorySceneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
