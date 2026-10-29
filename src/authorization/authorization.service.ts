import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Infant } from 'src/infant/entities/infant.entity';
import { Pictogram } from 'src/pictogram/entities/pictogram.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorizationService {
    constructor(
        @InjectRepository( Infant )
        private readonly infantRepository: Repository< Infant >,

        @InjectRepository( Pictogram )
        private readonly pictogramRepository: Repository< Pictogram >
    ) {}

    async infantBelongsToTutor( tutorId: string, infantId: string ) {
        return await this.infantRepository.exists({
            where: { 
                id: infantId,
                users: { id: tutorId }
            },
        })
    } 

    async pictogramBelongsToTutor( tutorId: string, pictogramId: string ) {
        return await this.pictogramRepository.exists({
            where: {
                id: pictogramId,
                user: { id: tutorId }
            }
        })
    }
}
