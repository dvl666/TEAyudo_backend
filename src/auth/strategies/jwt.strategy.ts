import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from '../constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IsStrongPassword } from 'class-validator';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<Partial<User>> {
    const { email } = payload;
    if ( !email ) throw new UnauthorizedException('Token not valid');
    const user = await this.userService.findOneByEmail(email);
    const { password, firstName, lastName, administrativePin, pictograms, infants, ...restUser } = user
    return restUser;
  }
}