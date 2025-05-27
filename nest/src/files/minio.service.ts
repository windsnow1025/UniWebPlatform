import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Readable } from 'stream';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Client;
  private readonly bucketName: string;
  private readonly webUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>('minio.endPoint')!,
      port: this.configService.get<number>('minio.port'),
      useSSL: this.configService.get<boolean>('minio.useSSL'),
      accessKey: this.configService.get<string>('minio.accessKey')!,
      secretKey: this.configService.get<string>('minio.secretKey')!,
    });
    this.bucketName = this.configService.get<string>('minio.bucketName')!;
    this.webUrl = this.configService.get<string>('minio.webUrl')!;
  }

  async onModuleInit() {
    let bucketExists: boolean;
    try {
      bucketExists = await this.minioClient.bucketExists(this.bucketName);
    } catch (error) {
      console.error('Unable to connect to MinIO:', error.message);
      return;
    }

    if (bucketExists) {
      console.log(`Bucket "${this.bucketName}" found.`);
      return;
    }

    await this.minioClient.makeBucket(this.bucketName);
    console.log(`Bucket "${this.bucketName}" created.`);

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    await this.minioClient.setBucketPolicy(
      this.bucketName,
      JSON.stringify(policy),
    );
    console.log(`Bucket policy for "${this.bucketName}" set to public.`);
  }

  getFileUrl(fileName: string): string {
    return `${this.webUrl}/${this.bucketName}/${fileName}`;
  }

  async uploadFile(
    fullFilename: string,
    buffer: Buffer,
    size: number,
    mimetype: string,
  ): Promise<void> {
    const fileStream = Readable.from(buffer);
    try {
      await this.minioClient.putObject(
        this.bucketName,
        fullFilename,
        fileStream,
        size,
        {
          'Content-Type': mimetype,
        },
      );
    } catch (error) {
      console.error('Error uploading file:', error.message);
      throw error;
    }
  }

  async listObjects(prefix: string): Promise<string[]> {
    const objects = await this.minioClient
      .listObjects(this.bucketName, prefix, true)
      .toArray();
    return objects.map((object) => object.name);
  }

  async removeObject(fileName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  async getTotalSize(prefix: string): Promise<number> {
    const objects = await this.minioClient
      .listObjects(this.bucketName, prefix, true)
      .toArray();
    return objects.reduce((acc, obj) => acc + (obj.size || 0), 0);
  }
}
