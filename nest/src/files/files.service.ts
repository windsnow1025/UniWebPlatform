import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
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
    let bucketExists: boolean;
    try {
      bucketExists = await this.minioClient.bucketExists(this.bucketName);
    } catch (error) {
      console.error('Unable to connect to MinIO:', error.message);
      return;
    }

    if (bucketExists) {
      console.log(`Bucket "${this.bucketName}" already exists.`);
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

  async create(userId: number, file: Express.Multer.File): Promise<string> {
    const originalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const filename = `${Date.now()}-${originalName}`;
    const fullFilename = `uploads/${userId}/${filename}`;
    const fileStream = Readable.from(file.buffer);

    await this.minioClient.putObject(
      this.bucketName,
      fullFilename,
      fileStream,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return fullFilename;
  }

  async findAll(userId: number): Promise<string[]> {
    const objects = await this.minioClient
      .listObjects(this.bucketName, `uploads/${userId}/`, true)
      .toArray();
    return objects.map((object) => object.name);
  }

  async deleteFiles(userId: number, fileNames: string[]): Promise<void> {
    const fullFileNames = fileNames.map(
      (fileName) => `uploads/${userId}/${fileName}`,
    );
    await Promise.all(
      fullFileNames.map(async (fileName) => {
        await this.minioClient.removeObject(this.bucketName, fileName);
      }),
    );
  }
}
