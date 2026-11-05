import { UseGuards } from '@nestjs/common';
import { InfantBelongsToTutorGuard } from 'src/authorization/guards/infantBelongsToTutor/infant-belongs-to-tutor.guard';
import { PictogramBelongsToTutorGuard } from 'src/authorization/guards/pictogramBelongsToTutor/pictogram-belongs-to-tutor.guard';
import { SelfGuard } from 'src/authorization/guards/self/self.guard';
import { AccessType } from 'src/authorization/interfaces/access-type.interface';

const guards = {
  [ AccessType.SELF ]: SelfGuard,
  [ AccessType.INFANT ]: InfantBelongsToTutorGuard,
  [ AccessType.PICTOGRAM ]: PictogramBelongsToTutorGuard,
};

type AuthorizationTarget = keyof typeof guards;

export const Authorization = (target: AuthorizationTarget) =>
  UseGuards(guards[target]);