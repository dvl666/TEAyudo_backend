import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { META_FIELD } from 'src/pictogram/decorators/valid-field/valid-field.decorator';
import { ValidFields } from 'src/pictogram/interfaces/valid-fields.interface';
import { PictogramService } from 'src/pictogram/pictogram.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TutorParamGuard implements CanActivate {

  constructor(
    private readonly reflector : Reflector,
    private readonly pictogramService : PictogramService
  ) {}
  async canActivate( ctx: ExecutionContext ): Promise<boolean> {

    
    const fields = this.reflector.getAllAndOverride<ValidFields>(
      META_FIELD,
      [ ctx.getHandler(), ctx.getClass() ]
    )
    const req = ctx.switchToHttp().getRequest()
    const user : User = req.user

    
    if ( !user ) throw new BadRequestException('No se a encontrado al user en la request')

      for (const field of fields) {
    const value = req.params[field];

    if (!value) {
      throw new BadRequestException(`Falta el parámetro ${field}`);
    }

    if ( user.roles.includes(ValidRoles.ADMIN) ) return true

    switch (field) {
      case ValidFields.TUTOR_ID:
        if (user.id !== value) {
          throw new ForbiddenException(
            'No puedes consultar datos de otro usuario',
          );
        }
        break;

      case ValidFields.PICTOGRAM_ID: {
        console.log('hola')
        const belongs =
          await this.pictogramService.pictogramBelongsToUser(
            value,
            user.id,
          );

        if (!belongs) {
          throw new ForbiddenException(
            'No puedes editar pictogramas de otros usuarios',
          );
        }
        break;
      }

      default:
        throw new InternalServerErrorException(
          `Campo de propiedad no soportado: ${field}`,
        );
    }
  }

    return true
  }
}
