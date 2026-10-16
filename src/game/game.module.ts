import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictogramModule } from 'src/pictogram/pictogram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    PictogramModule,
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
