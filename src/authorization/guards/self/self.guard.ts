import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SelfGuard implements CanActivate {

  constructor(
    private readonly reflector : Reflector,
    private readonly authorizationService : AuthorizationService
  ) {}

  async canActivate( ctx: ExecutionContext ): Promise<boolean> {

    const req = ctx.switchToHttp().getRequest()
    const tutorId = req.params.tutorId
    const user : User = req.user

    if ( !tutorId ) throw new BadRequestException( 'Falta el parametro userId' )

    if ( !user ) throw new BadRequestException( 'No se a encontrado al usuario en la request' )

    if ( user.roles.includes( ValidRoles.ADMIN ) ) return true

    if ( user.id != tutorId ) throw new BadRequestException( 'El user del parametro no coincide con el del request' )

    return true
  }
}
