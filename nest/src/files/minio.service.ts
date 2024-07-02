import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Readable } from 'stream';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>('minio.endPoint')!,
      port: this.configService.get<number>('minio.port'),
      useSSL: this.configService.get<boolean>('minio.useSSL'),
      accessKey: this.configService.get<string>('minio.accessKey')!,
      secretKey: this.configService.get<string>('minio.secretKey')!,
    });
    this.bucketName = this.configService.get<string>('minio.bucketName')!;
    this.initializeBucket();
  }

  private async initializeBucket() {
    if (await this.minioClient.bucketExists(this.bucketName)) {
      return;
    }

    await this.minioClient.makeBucket(this.bucketName);
    console.log(`Bucket ${this.bucketName} created.`);

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
    console.log(`Bucket policy for ${this.bucketName} set to public.`);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileStream = Readable.from(file.buffer);

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      fileStream,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return fileName;
  }

  getFileUrl(protocol: string, host: string, fileName: string): string {
    const minioBaseUrl = this.configService.get<string>('minioBaseUrl')!;
    const url = new URL(`${protocol}://${host}`);
    const hostname = url.hostname;

    let minioHost: string;
    if (minioBaseUrl === '') {
      const minioPort = this.configService.get<number>('minio.port');
      minioHost = `${hostname}:${minioPort}`;
    } else {
      minioHost = host;
    }

    return `${protocol}://${minioHost}${minioBaseUrl}/${this.bucketName}/${fileName}`;
  }
}
