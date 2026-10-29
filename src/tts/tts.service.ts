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

  // En AWS Lambda (detectado por AWS_LAMBDA_FUNCTION_NAME), no pasamos credenciales estáticas
  // para que el SDK use automáticamente el Execution Role de IAM de la Lambda.
  private readonly client = new PollyClient({
    region:
      process.env.POLLY_REGION ??
      process.env.AWS_REGION ??
      'sa-east-1',
    credentials:
      process.env.POLLY_ACCESS_KEY && process.env.POLLY_SECRET_KEY
        ? {
            accessKeyId: process.env.POLLY_ACCESS_KEY,
            secretAccessKey: process.env.POLLY_SECRET_KEY,
          }
        : process.env.AWS_LAMBDA_FUNCTION_NAME
        ? undefined
        : process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
          }
        : undefined,
  });

  /**
   * Sintetiza texto a voz utilizando Amazon Polly con la voz 'Lucia' en modo standard.
   * Si falla, lanzará error y el frontend recurrirá automáticamente a la voz de Google (navegador).
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

    // Única voz de Polly: Lucia en motor standard
    const voiceId: VoiceId = 'Lucia';
    const engine: Engine = 'standard';

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
