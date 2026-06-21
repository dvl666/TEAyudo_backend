import { Module } from '@nestjs/common';
import { GameProgressService } from './game-progress.service';
import { GameProgressController } from './game-progress.controller';
import { GameProgress } from './entities/game-progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GameProgress])],
  controllers: [GameProgressController],
  providers: [GameProgressService],
})
export class GameProgressModule {}
