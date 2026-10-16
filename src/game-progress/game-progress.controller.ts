import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameProgressService } from './game-progress.service';
import { CreateGameProgressDto } from './dtos/create-game-progress.dto';

@Controller('game-progress')
export class GameProgressController {
  constructor(
    private readonly gameProgressService: GameProgressService
  ) {}

  @Get('infant/:infantId')
  getGameProgressByInfantId(@Param('infantId') infantId: string) {
    return this.gameProgressService.getGameProgressByInfantId(infantId);
  }

  @Post()
  createGameProgress( @Body() gameProgressData: CreateGameProgressDto) {
    console.log('Received game progress data:', gameProgressData);
    return this.gameProgressService.createGameProgress(gameProgressData)
  }
}
