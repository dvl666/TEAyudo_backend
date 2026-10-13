import {
  RekognitionClient,
  DetectModerationLabelsCommand,
  ModerationLabel,
} from '@aws-sdk/client-rekognition';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);
  private readonly client = new RekognitionClient({
    region: process.env.AWS_REGION ?? 'sa-east-1',
    credentials:
      process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
          }
        : undefined,
  });

  /**
   * Analiza una imagen en memoria con AWS Rekognition.
   * Si detecta contenido inapropiado con un nivel de confianza >= minConfidence,
   * lanza una BadRequestException impidiendo la subida a S3 y base de datos.
   *
   * @param imageBuffer Buffer de la imagen recibida
   * @param minConfidence Nivel mínimo de confianza (default 60%)
   */
  async validateImageBuffer(imageBuffer: Buffer, minConfidence = 60): Promise<void> {
    try {
      const command = new DetectModerationLabelsCommand({
        Image: {
          Bytes: imageBuffer,
        },
        MinConfidence: minConfidence,
      });

      const response = await this.client.send(command);
      const labels: ModerationLabel[] = response.ModerationLabels ?? [];

      if (labels.length > 0) {
        const detectedCategories = Array.from(
          new Set(
            labels
              .map((l) => l.ParentName || l.Name)
              .filter((name): name is string => Boolean(name)),
          ),
        );

        this.logger.warn(
          `Imagen rechazada por Rekognition. Etiquetas detectadas: ${detectedCategories.join(', ')}`,
        );

        throw new BadRequestException(
          `La imagen no cumple con las normas de seguridad de contenido infantil (detectado: ${detectedCategories.join(', ')}). Por favor selecciona otra imagen.`,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error al analizar la imagen con AWS Rekognition', error);
      // Si Rekognition falla por permisos o red, permitimos o manejamos según sea necesario
      // Opcional: podrías relanzar o dejar pasar dependiendo de cuán estricto se desee
    }
  }
}
