import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameProgress } from './entities/game-progress.entity';
import { Repository } from 'typeorm';
import { CreateGameProgressDto } from './dtos/create-game-progress.dto';
import { InfantService } from 'src/infant/infant.service';
import { GameService } from 'src/game/game.service';
import { PictogramService } from 'src/pictogram/pictogram.service';

@Injectable()
export class GameProgressService {

    constructor(
        @InjectRepository(GameProgress)
        private readonly gameProgressRepository: Repository<GameProgress>,
    ) {}

    getGameProgressByInfantId(infantId: string): Promise<GameProgress[]> {
        const gameProgresses = this.gameProgressRepository.find({
            where: { infant: { id: infantId } },
            relations: { categoryPlayed: true },
        });
        
        if (!gameProgresses) throw new NotFoundException(`No game progress found for infant with ID ${infantId}`);
        
        return gameProgresses;
    }

    async createGameProgress(gameProgressData: CreateGameProgressDto): Promise<GameProgress> {
        const date = new Date().toISOString()
        const newGameProgress = this.gameProgressRepository.create({
             ...gameProgressData, 
             infant: { id: gameProgressData.infantId }, 
             game: { id: gameProgressData.game }, 
             gameDate: 
             date, 
             categoryPlayed: { id: gameProgressData.categoryPlayedId } });
        return await this.gameProgressRepository.save(newGameProgress);
    }
}
