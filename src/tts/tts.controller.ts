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
      { id: 'Lucia', name: 'Lucía (Español - Femenina, muy clara)', lang: 'es-ES', engine: 'standard' },
      { id: 'Conchita', name: 'Conchita (Español - Femenina)', lang: 'es-ES', engine: 'standard' },
      { id: 'Enrique', name: 'Enrique (Español - Masculina)', lang: 'es-ES', engine: 'standard' },
      { id: 'Penelope', name: 'Penélope (Español Latinoamericano - Femenina)', lang: 'es-US', engine: 'standard' },
      { id: 'Lupe', name: 'Lupe (Español Latinoamericano - Femenina)', lang: 'es-US', engine: 'standard' },
    ];
  }
}
