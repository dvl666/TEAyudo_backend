import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dtos/create-game.dto';
import { PictogramService } from 'src/pictogram/pictogram.service';

@Injectable()
export class GameService {

    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        private readonly pictogramService: PictogramService,
    ) {}

    async createGame(createGameDto: CreateGameDto): Promise<Game> {
        const createdGame = await this.gameRepository.save(createGameDto);
        return createdGame;
    }

    async findAllGames(): Promise<Game[]> {
        const games = await this.gameRepository.find();
        return games;
    }

    async findGameById(gameId: string): Promise<Game> {
        const game = await this.gameRepository.findOne({ where: { id: gameId } });
        if (!game) throw new NotFoundException(`Game with ID ${gameId} not found`);
        return game;
    }

    async createGameWhatItIs(categoryId: string) {
        return this.pictogramService.find20ByCategory(categoryId);
    }
}
