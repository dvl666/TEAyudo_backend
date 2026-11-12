import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IsStrongPassword } from 'class-validator';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor(
    private readonly userService: UserService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { userId } = payload;
    if ( !userId ) throw new UnauthorizedException('Token not valid');
    const user = await this.userService.findOne(userId);
    const { password, firstName, lastName, administrativePin, pictograms, infants, ...restUser } = user
    return restUser;
  }
}
