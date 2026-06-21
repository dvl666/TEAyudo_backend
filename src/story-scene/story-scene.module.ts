import { Module } from '@nestjs/common';
import { StorySceneService } from './story-scene.service';
import { StorySceneController } from './story-scene.controller';
import { StoryScene } from './entities/story-scene.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StoryScene])],
  controllers: [StorySceneController],
  providers: [StorySceneService],
})
export class StorySceneModule {}
