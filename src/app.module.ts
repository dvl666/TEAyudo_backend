import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { InfantModule } from './infant/infant.module';
import { CategoryModule } from './category/category.module';
import { PictogramModule } from './pictogram/pictogram.module';
import { PhraseModule } from './phrase/phrase.module';
import { PhrasePictogramModule } from './phrase-pictogram/phrase-pictogram.module';
import { GameModule } from './game/game.module';
import { GameProgressModule } from './game-progress/game-progress.module';
import { RoutineModule } from './routine/routine.module';
import { StorySceneModule } from './story-scene/story-scene.module';
import { User } from './user/entities/user.entity';
import { StoryScene } from './story-scene/entities/story-scene.entity';
import { Routine } from './routine/entities/routine.entity';
import { Game } from './game/entities/game.entity';
import { Infant } from './infant/entities/infant.entity';
import { Pictogram } from './pictogram/entities/pictogram.entity';
import { Phrase } from './phrase/entities/phrase.entity';
import { PhrasePictogram } from './phrase-pictogram/entities/phrase-pictogram.entity';
import { GameProgress } from './game-progress/entities/game-progress.entity';
import { Category } from './category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dvl',
      password: '666',
      database: 'appdb',
      entities: [User, Routine, Game, Infant, Pictogram, Phrase, PhrasePictogram, StoryScene, GameProgress, Category],
      synchronize: true,
    }),
    UserModule,
    InfantModule,
    CategoryModule,
    PictogramModule,
    PhraseModule,
    PhrasePictogramModule,
    GameModule,
    GameProgressModule,
    RoutineModule,
    StorySceneModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
