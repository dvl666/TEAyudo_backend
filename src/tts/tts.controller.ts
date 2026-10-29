import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { TtsService } from './tts.service';
import { SynthesizeSpeechDto } from './dto/synthesize-speech.dto';

@Controller('tts')
export class TtsController {
  private readonly logger = new Logger(TtsController.name);

  constructor(private readonly ttsService: TtsService) {}

  @Post('synthesize')
  async synthesize(@Body() dto: SynthesizeSpeechDto) {
    try {
      return await this.ttsService.synthesize(dto);
    } catch (error) {
      this.logger.error('Error al sintetizar voz con Amazon Polly', error);
      const errorMsg = error?.message || error?.name || 'Error desconocido en Polly';
      throw new InternalServerErrorException(`Polly: ${errorMsg}`);
    }
  }

  @Get('voices')
  getRecommendedVoices() {
    return [
      { id: 'Lucia', name: 'Lucía (Español - Femenina, estándar)', lang: 'es-ES', engine: 'standard' },
    ];
  }
}
