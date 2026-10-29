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
   * Sintetiza texto a voz utilizando Amazon Polly en modo Standard (compatible con sa-east-1).
   * Utiliza por defecto la voz estándar en español 'Lucia' (o 'Conchita'/'Lupe').
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

    // Por defecto en sa-east-1 usamos motor standard y voz Lucia (muy nítida en español)
    const voiceId = (dto.voiceId || 'Lucia') as VoiceId;
    const engine: Engine = (dto.engine || 'standard') as Engine;

    try {
      return await this.executeSynthesis(text, voiceId, engine);
    } catch (error) {
      this.logger.warn(
        `Error al sintetizar con voz ${voiceId} y motor ${engine}: ${error?.message}. Probando fallback a voz Lucia en standard...`,
      );

      // Si falló con la voz solicitada o con neural, intentamos con Lucia en standard
      if (voiceId !== 'Lucia' || engine !== 'standard') {
        try {
          return await this.executeSynthesis(text, 'Lucia' as VoiceId, 'standard');
        } catch (fallbackError) {
          // Si Lucia fallase, intentamos Conchita
          try {
            return await this.executeSynthesis(text, 'Conchita' as VoiceId, 'standard');
          } catch (thirdError) {
            this.logger.error('Error total en síntesis de Polly en sa-east-1', thirdError);
            throw thirdError;
          }
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
