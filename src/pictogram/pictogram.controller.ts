import { Controller } from '@nestjs/common';
import { PictogramService } from './pictogram.service';

@Controller('pictogram')
export class PictogramController {
  constructor(private readonly pictogramService: PictogramService) {}
}
