import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';

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
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        const hashedAdministrativePin = await bcrypt.hash(createUserDto.administrativePin, 12);

        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            administrativePin: hashedAdministrativePin,
        });
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
        if (!user) throw new NotFoundException(`User with email ${email} not found`);
        return user;
    }

    // async login(loginData: LoginDto): Promise<boolean> {
    //     console.log(`Attempting login for user with email: ${loginData.email}`);
    //     const user = await this.findOneByEmail(loginData.email);
    //     const isMatch = await bcrypt.compare(loginData.password, user.password);
    //     if (!isMatch) throw new NotFoundException(`Invalid password for user with email ${loginData.email}`);
    //     return true;
    // }

    async validateAdministrativePin(userId: string, pin: string): Promise<boolean> {
        const user = await this.findOne(userId);
        const isMatch = await bcrypt.compare(pin, user!.administrativePin);
        if (!isMatch) throw new NotFoundException(`Invalid administrative pin for user with ID ${userId}`);
        return true;
    }
}
