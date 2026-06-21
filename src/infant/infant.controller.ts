import { Controller } from '@nestjs/common';
import { InfantService } from './infant.service';

@Controller('infant')
export class InfantController {
  constructor(private readonly infantService: InfantService) {}
}
