import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async findOneUserWithInfants(id: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: { infants: true },
        });
        return user;
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }

    async login(loginData: LoginDto): Promise<boolean> {
        const user = await this.findOneByEmail(loginData.email);
        if (user.password !== loginData.password) throw new NotFoundException(`Invalid password for user with email ${loginData.email}`);
        return true;
    }

}
