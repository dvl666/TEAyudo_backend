import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import type { Context } from 'aws-lambda';

/**
 * ============================================================================
 * HANDLER PRINCIPAL PARA AWS LAMBDA (TEAyudo Backend)
 * ============================================================================
 * Inicializa la aplicación NestJS en el entorno Serverless de AWS Lambda
 * con Amazon API Gateway.
 */
let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS para permitir peticiones desde AWS Amplify y otros orígenes
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({
    app: expressApp,
    binarySettings: {
      contentTypes: [
        'multipart/form-data',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/octet-stream',
      ],
    },
  });
}

export const handler = async (event: any, context: Context) => {
  console.log('Incoming Lambda Event:', {
    httpMethod: event.httpMethod || event.requestContext?.http?.method,
    path: event.path || event.rawPath,
    headers: event.headers,
    isBase64Encoded: event.isBase64Encoded,
  });

  // Reutiliza la instancia de NestJS en memoria entre invocaciones (Warm Start)
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(event, context);
};
