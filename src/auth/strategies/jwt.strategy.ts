import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from '../constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email, userId } = payload;
    if ( !email ) throw new UnauthorizedException('Token not valid');
    return this.userService.findOneByEmail(email);
  }
}