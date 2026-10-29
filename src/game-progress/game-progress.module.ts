import { Module } from '@nestjs/common';
import { GameProgressService } from './game-progress.service';
import { GameProgressController } from './game-progress.controller';
import { GameProgress } from './entities/game-progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfantModule } from 'src/infant/infant.module';
import { GameModule } from 'src/game/game.module';
import { CategoryModule } from 'src/category/category.module';
import { AuthModule } from 'src/auth/auth.module';
import { PictogramModule } from 'src/pictogram/pictogram.module';
import { AuthorizationModule } from 'src/authorization/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameProgress]),
    InfantModule,
    GameModule,
    CategoryModule,
    AuthModule,
    PictogramModule,
    AuthorizationModule
  ],
  controllers: [GameProgressController],
  providers: [GameProgressService],
})
export class GameProgressModule {}
