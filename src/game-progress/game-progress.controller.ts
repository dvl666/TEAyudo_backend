import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameProgressService } from './game-progress.service';
import { CreateGameProgressDto } from './dtos/create-game-progress.dto';
import { Belongs } from 'src/decorators/belongs/belongs.decorator';
import { ValidFields } from 'src/pictogram/interfaces/valid-fields.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('game-progress')
export class GameProgressController {
  constructor(
    private readonly gameProgressService: GameProgressService
  ) {}

  @Belongs( ValidFields.INFANT_ID )
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
