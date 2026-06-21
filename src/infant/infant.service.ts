import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Infant } from './entities/infant.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { CreateInfantDto } from './dtos/create-infant.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InfantService {
    constructor(
        @InjectRepository(Infant)
        private readonly infantRepository: Repository<Infant>,
        private readonly userService: UserService,

    ) {}

    async create(createInfantDto: CreateInfantDto): Promise<Infant> {
        const user = await this.userService.findOne(createInfantDto.userId);
        const { userId, ...infantData } = createInfantDto;
        const infant = this.infantRepository.create(infantData);
        infant.users = [user!];
        return this.infantRepository.save(infant);
    }

    findAll(): Promise<Infant[]> {
        return this.infantRepository.find();
    }

    findOne(id: string): Promise<Infant | null> {
        const infant = this.infantRepository.findOne({ where: { id } });
        if (!infant) throw new NotFoundException(`Infant with id ${id} not found`);
        return infant;
    }
}
