import { Body, Controller, Get, Post } from '@nestjs/common';
import { TtsService } from './tts.service';
import { SynthesizeSpeechDto } from './dto/synthesize-speech.dto';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post('synthesize')
  async synthesize(@Body() dto: SynthesizeSpeechDto) {
    return await this.ttsService.synthesize(dto);
  }

  @Get('voices')
  getRecommendedVoices() {
    return [
      { id: 'Mia', name: 'Mia (México - Femenina, juvenil)', lang: 'es-MX', engine: 'neural' },
      { id: 'Lupe', name: 'Lupe (EE.UU. / Latino - Femenina, amigable)', lang: 'es-US', engine: 'neural' },
      { id: 'Andres', name: 'Andrés (Latino - Masculina)', lang: 'es-US', engine: 'neural' },
      { id: 'Lucia', name: 'Lucía (España - Femenina)', lang: 'es-ES', engine: 'neural' },
      { id: 'Pedro', name: 'Pedro (Latino - Masculina)', lang: 'es-US', engine: 'neural' },
    ];
  }
}
