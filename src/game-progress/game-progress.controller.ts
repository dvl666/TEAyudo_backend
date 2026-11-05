import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameProgressService } from './game-progress.service';
import { CreateGameProgressDto } from './dtos/create-game-progress.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { Authorization } from 'src/authorization/decorators/authorization/authorization.decorator';
import { AccessType } from 'src/authorization/interfaces/access-type.interface';

@Controller('game-progress')
export class GameProgressController {
  constructor(
    private readonly gameProgressService: GameProgressService
  ) {}

  @Authorization( AccessType.INFANT )
  @Auth( ValidRoles.USER )
  @Get('infant/:infantId')
  getGameProgressByInfantId(@Param('infantId') infantId: string) {
    return this.gameProgressService.getGameProgressByInfantId(infantId);
  }

  @Auth( ValidRoles.USER )
  @Post()
  createGameProgress( @Body() gameProgressData: CreateGameProgressDto) {
    console.log('Received game progress data:', gameProgressData);
    return this.gameProgressService.createGameProgress(gameProgressData)
  }
}
