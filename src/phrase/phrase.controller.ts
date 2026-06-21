import { Controller } from '@nestjs/common';
import { PhraseService } from './phrase.service';

@Controller('phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}
}
