import { SetMetadata } from '@nestjs/common';
import { ValidFields } from 'src/pictogram/interfaces/valid-fields.interface';

export const META_FIELD = 'fields'

export const ValidField = (...args: ValidFields[]) => {
    
    return SetMetadata( META_FIELD, args );
}
    
