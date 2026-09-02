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
import { StorageModule } from './storage/storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'dvl',
      password: process.env.DB_PASSWORD ?? '666',
      database: process.env.DB_DATABASE ?? 'appdb',
      entities: [
        User,
        Routine,
        Game,
        Infant,
        Pictogram,
        Phrase,
        PhrasePictogram,
        StoryScene,
        GameProgress,
        Category,
      ],
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
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
