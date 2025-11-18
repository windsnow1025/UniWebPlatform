import { Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';

@Injectable()
export class FilesService {
  public readonly maxTotalSize = 256 * 1024 * 1024; // 256MB

  constructor(private readonly minioService: MinioService) {}

  getFileUrl(fullFilename: string): string {
    return this.minioService.getFileUrl(fullFilename);
  }

  getFileUrls(fullFilenames: string[]): string[] {
    return fullFilenames.map((fileName) => this.getFileUrl(fileName));
  }

  async getUserTotalSize(userId: number): Promise<number> {
    return this.minioService.getTotalSize(`uploads/${userId}/`);
  }

  async getFilesSize(userId: number, fileNames: string[]): Promise<number> {
    const fullFileNames = fileNames.map(
      (fileName) => `uploads/${userId}/${fileName}`,
    );

    let totalSize = 0;
    for (const fullFileName of fullFileNames) {
      const size = await this.minioService.getObjectSize(fullFileName);
      totalSize += size;
    }

    return totalSize;
  }

  async createFile(userId: number, file: Express.Multer.File): Promise<string> {
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

  async createFiles(
    userId: number,
    files: Array<Express.Multer.File>,
  ): Promise<string[]> {
    return await Promise.all(
      files.map(async (file) => {
        return this.createFile(userId, file);
      }),
    );
  }

  async cloneFile(userId: number, fileName: string): Promise<string> {
    const sourceFullFilename = `uploads/${userId}/${fileName}`;

    const originalFilename = fileName.substring(fileName.indexOf('-') + 1);
    const newFilename = `${Date.now()}-${originalFilename}`;
    const targetFullFilename = `uploads/${userId}/${newFilename}`;

    await this.minioService.copyObject(sourceFullFilename, targetFullFilename);

    return targetFullFilename;
  }

  async cloneFiles(userId: number, fileNames: string[]): Promise<string[]> {
    const newFullFilenames: string[] = [];

    for (const fileName of fileNames) {
      const destFullName = await this.cloneFile(userId, fileName);
      newFullFilenames.push(destFullName);
    }

    return newFullFilenames;
  }

  async getUserFullFilenames(userId: number): Promise<string[]> {
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
