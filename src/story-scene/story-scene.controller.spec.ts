import { Test, TestingModule } from '@nestjs/testing';
import { StorySceneController } from './story-scene.controller';
import { StorySceneService } from './story-scene.service';

describe('StorySceneController', () => {
  let controller: StorySceneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorySceneController],
      providers: [StorySceneService],
    }).compile();

    controller = module.get<StorySceneController>(StorySceneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
