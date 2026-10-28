import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ValidField } from '../valid-field/valid-field.decorator';
import { ValidFields } from 'src/pictogram/interfaces/valid-fields.interface';
import { TutorParamGuard } from 'src/guards/tutor-param/tutor-param.guard';

export function Belongs (...field: ValidFields[]) {

    return applyDecorators(
        ValidField(...field),
        UseGuards( TutorParamGuard )
    )

}
    
    
