import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dtos/create-game.dto';
import { Game } from './entities/game.entity';
import { PictogramService } from 'src/pictogram/pictogram.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
  ) {}

  @Get()
  findAllGames() {
    console.log('Fetching all games');
    return this.gameService.findAllGames();
  }

  @Post()
  createGame(@Body() createGameDto: CreateGameDto) : Promise<Game> {
    console.log('Received createGameDto:', createGameDto);
    return this.gameService.createGame(createGameDto);
  }

  @Get("start/game/what-it-is/category/:categoryId")
  startGameWhatItIs(@Param('categoryId') categoryId: string) {
    return this.gameService.createGameWhatItIs(categoryId);
  }
}
