import { Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';

@Injectable()
export class FilesService {
  constructor(private readonly minioService: MinioService) {}

  getFileUrl(fileName: string): string {
    return this.minioService.getFileUrl(fileName);
  }

  async create(userId: number, file: Express.Multer.File): Promise<string> {
    const originalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const filename = `${Date.now()}-${originalName}`;
    const fullFilename = `uploads/${userId}/${filename}`;

    await this.minioService.uploadFile(
      fullFilename,
      file.buffer,
      file.size,
      file.mimetype,
    );

    return fullFilename;
  }

  async findAll(userId: number): Promise<string[]> {
    return this.minioService.listObjects(`uploads/${userId}/`);
  }

  async deleteFiles(userId: number, fileNames: string[]): Promise<void> {
    const fullFileNames = fileNames.map(
      (fileName) => `uploads/${userId}/${fileName}`,
    );

    await Promise.all(
      fullFileNames.map(async (fileName) => {
        await this.minioService.removeObject(fileName);
      }),
    );
  }
}
