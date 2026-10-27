import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector : Reflector //Me deja ver informacion de los decoradores
  ) {}

  canActivate( ctx: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles : string[] = this.reflector.get( META_ROLES, ctx.getHandler() )
    
    if ( validRoles.length === 0 ) return true

    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;
    console.log(user)

    if ( !user ) throw new BadRequestException('No se a encontrado al user en la request')

    if ( user.roles.includes(ValidRoles.ADMIN) ) return true

    for ( const role of user.roles ) {
      if ( validRoles.includes(role) ) return true
    }

    throw new UnauthorizedException(`Unauthorized request, you need a valid role: ${validRoles}`)
  }
}
