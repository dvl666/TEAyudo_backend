import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly bucket = process.env.AWS_S3_BUCKET_NAME ?? 'teayudo';
  private readonly client = new S3Client({
    region: process.env.AWS_REGION ?? 'sa-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials:
      process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
          }
        : undefined,
  });

  async onModuleInit(): Promise<void> {
    if (process.env.S3_AUTO_CREATE_BUCKET !== 'true') return;
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  async upload(body: Buffer, originalName: string, contentType: string) {
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '-');
    const key = `pictograms/${randomUUID()}-${safeName}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentDisposition: 'inline',
      }),
    );
    return { key, url: await this.getSignedUrl(key) };
  }

  async uploadAvatar(body: Buffer, originalName: string, contentType: string) {
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '-');
    const key = `avatars/${randomUUID()}-${safeName}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentDisposition: 'inline',
      }),
    );
    return { key, url: await this.getSignedUrl(key) };
  }

  getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (!key) return Promise.resolve('');

    // Extraer solo la key limpia si venía como URL completa
    let cleanKey = key;
    if (cleanKey.includes('.amazonaws.com/')) {
      cleanKey = cleanKey.split('.amazonaws.com/')[1].split('?')[0];
    } else if (cleanKey.includes('.cloudfront.net/')) {
      cleanKey = cleanKey.split('.cloudfront.net/')[1].split('?')[0];
    }
    cleanKey = cleanKey.replace(/^\//, '');

    const cloudfrontUrl = process.env.CLOUDFRONT_URL;
    if (cloudfrontUrl) {
      const baseUrl = cloudfrontUrl.startsWith('http')
        ? cloudfrontUrl
        : `https://${cloudfrontUrl}`;
      return Promise.resolve(`${baseUrl.replace(/\/$/, '')}/${cleanKey}`);
    }

    const responseContentType = this.getImageContentType(cleanKey);
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: cleanKey,
        ResponseContentDisposition: 'inline',
        ResponseContentType: responseContentType,
      }),
      { expiresIn },
    );
  }

  private getImageContentType(key: string): string | undefined {
    const extension = key.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    return extension ? contentTypes[extension] : undefined;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
