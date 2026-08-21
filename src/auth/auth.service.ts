import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/user/dtos/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async login(loginData: LoginDto) {
        console.log(`Attempting login for user with email: ${loginData.email}`);
        const user = await this.usersService.findOneByEmail(loginData.email);
        const isMatch = await bcrypt.compare(loginData.password, user.password);
        if (!isMatch) throw new NotFoundException(`Invalid password for user with email ${loginData.email}`);

        return {
            ...user,
            token: this.getJWT({ email: user.email, userId: user.id }),
        }

    }

    private getJWT( payload: JwtPayload ) {
        const token = this.jwtService.sign(payload);
        return token;
    }
}
