import { Controller } from '@nestjs/common';
import { PhrasePictogramService } from './phrase-pictogram.service';

@Controller('phrase-pictogram')
export class PhrasePictogramController {
  constructor(private readonly phrasePictogramService: PhrasePictogramService) {}
}
