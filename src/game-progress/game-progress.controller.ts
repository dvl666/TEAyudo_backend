import { Controller } from '@nestjs/common';
import { GameProgressService } from './game-progress.service';

@Controller('game-progress')
export class GameProgressController {
  constructor(private readonly gameProgressService: GameProgressService) {}
}
