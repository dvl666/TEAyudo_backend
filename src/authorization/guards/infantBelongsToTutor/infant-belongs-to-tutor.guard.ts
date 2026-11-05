import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class InfantBelongsToTutorGuard implements CanActivate {

  constructor(
    private readonly reflector : Reflector,
    private readonly authorizationService : AuthorizationService
  ) {}

  async canActivate( ctx: ExecutionContext ): Promise<boolean> {

    const req = ctx.switchToHttp().getRequest()
    const infantId = req.params.infantId
    const user : User = req.user

    if ( !infantId ) throw new BadRequestException( 'Falta el parametro infantId' )

    if ( !user ) throw new BadRequestException( 'No se a encontrado al usuario en la request' )

    if ( user.roles.includes( ValidRoles.ADMIN ) ) return true

    const valid = await this.authorizationService.infantBelongsToTutor( user.id, infantId )

    if ( !valid ) throw new ForbiddenException( 'No tienes acceso a este infante' )

    return true
  }
}
