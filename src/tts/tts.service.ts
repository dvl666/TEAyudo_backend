import {
  Engine,
  OutputFormat,
  PollyClient,
  SynthesizeSpeechCommand,
  VoiceId,
} from '@aws-sdk/client-polly';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SynthesizeSpeechDto } from './dto/synthesize-speech.dto';

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);

  private readonly client = new PollyClient({
    region:
      process.env.POLLY_REGION ??
      process.env.AWS_REGION ??
      'sa-east-1',
    credentials:
      process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
          }
        : process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });

  /**
   * Sintetiza texto a voz utilizando Amazon Polly.
   * Por defecto utiliza la voz neural 'Mia' (es-MX), ideal para niños y entornos educativos.
   * Si el motor neural falla o no está disponible en la región/voz, hace fallback automático al motor standard.
   */
  async synthesize(dto: SynthesizeSpeechDto): Promise<{
    audioBase64: string;
    mimeType: string;
    voiceId: string;
    engine: string;
  }> {
    const text = dto.text?.trim();
    if (!text) {
      throw new BadRequestException('El texto a sintetizar no puede estar vacío');
    }

    const voiceId = (dto.voiceId || 'Mia') as VoiceId;
    let preferredEngine = (dto.engine || 'neural') as Engine;

    try {
      return await this.executeSynthesis(text, voiceId, preferredEngine);
    } catch (error) {
      this.logger.warn(
        `Error al sintetizar con motor ${preferredEngine}: ${error?.message}. Intentando fallback a standard...`,
      );

      // Si falló con neural (ej. no soportado en la región o para esa voz específica), probamos con standard
      if (preferredEngine === 'neural') {
        try {
          return await this.executeSynthesis(text, voiceId, 'standard');
        } catch (fallbackError) {
          this.logger.error('Error en fallback con motor standard de Polly', fallbackError);
          throw fallbackError;
        }
      }

      throw error;
    }
  }

  private async executeSynthesis(
    text: string,
    voiceId: VoiceId,
    engine: Engine,
  ): Promise<{
    audioBase64: string;
    mimeType: string;
    voiceId: string;
    engine: string;
  }> {
    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: OutputFormat.MP3,
      VoiceId: voiceId,
      Engine: engine,
    });

    const response = await this.client.send(command);

    if (!response.AudioStream) {
      throw new Error('Amazon Polly no devolvió un flujo de audio válido.');
    }

    const byteArray = await response.AudioStream.transformToByteArray();
    const audioBase64 = Buffer.from(byteArray).toString('base64');

    return {
      audioBase64,
      mimeType: 'audio/mp3',
      voiceId,
      engine,
    };
  }
}
