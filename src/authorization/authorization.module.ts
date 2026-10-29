import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Infant } from 'src/infant/entities/infant.entity';
import { Pictogram } from 'src/pictogram/entities/pictogram.entity';
import { InfantBelongsToTutorGuard } from './guards/infantBelongsToTutor/infant-belongs-to-tutor.guard';
import { PictogramBelongsToTutorGuard } from './guards/pictogramBelongsToTutor/pictogram-belongs-to-tutor.guard';
import { SelfGuard } from './guards/self/self.guard';

@Module({
  imports: [ TypeOrmModule.forFeature( [ Infant, Pictogram ] ) ],
  controllers: [  ],
  providers: [ AuthorizationService, InfantBelongsToTutorGuard, PictogramBelongsToTutorGuard, SelfGuard ],
  exports: [ AuthorizationService, InfantBelongsToTutorGuard, PictogramBelongsToTutorGuard, SelfGuard ]
})

export class AuthorizationModule {}
