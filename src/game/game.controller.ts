import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dtos/create-game.dto';
import { Game } from './entities/game.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
  ) {}

  @Get()
  @Auth( ValidRoles.USER )
  findAllGames() {
    console.log('Fetching all games');
    return this.gameService.findAllGames();
  }

  @Post()
  @Auth( ValidRoles.ADMIN )
  createGame(@Body() createGameDto: CreateGameDto) : Promise<Game> {
    console.log('Received createGameDto:', createGameDto);
    return this.gameService.createGame(createGameDto);
  }

  
  @Get("start/game/what-it-is/category/:categoryId")
  @Auth( ValidRoles.USER )
  startGameWhatItIs(@Param('categoryId') categoryId: string) {
    return this.gameService.createGameWhatItIs(categoryId);
  }
}
