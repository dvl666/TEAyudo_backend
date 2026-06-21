import { Controller } from '@nestjs/common';
import { StorySceneService } from './story-scene.service';

@Controller('story-scene')
export class StorySceneController {
  constructor(private readonly storySceneService: StorySceneService) {}
}
