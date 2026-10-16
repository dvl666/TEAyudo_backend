import { Module } from '@nestjs/common';
import { GameProgressService } from './game-progress.service';
import { GameProgressController } from './game-progress.controller';
import { GameProgress } from './entities/game-progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfantModule } from 'src/infant/infant.module';
import { GameModule } from 'src/game/game.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameProgress]),
    InfantModule,
    GameModule,
    CategoryModule,
  ],
  controllers: [GameProgressController],
  providers: [GameProgressService],
})
export class GameProgressModule {}
