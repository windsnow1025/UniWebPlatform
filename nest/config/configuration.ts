import * as process from 'node:process';
import * as path from 'node:path';
import * as fs from 'node:fs';

const loadJsonConfigFile = (filename: string, isProduction: boolean): any => {
  const baseDirectory = isProduction ? '/app/config' : process.cwd();

  const filePath = path.resolve(baseDirectory, filename);

  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
};

export default () => {
  const isProduction = process.env.ENV !== 'development';
  console.log(`Using ${isProduction ? 'production' : 'development'} setting.`);

  const firebaseConfig = loadJsonConfigFile(
    'firebaseConfig.json',
    isProduction,
  );
  const serviceAccountKey = loadJsonConfigFile(
    'serviceAccountKey.json',
    isProduction,
  );

  return {
    port: isProduction ? 3000 : 3001,
    jwtSecret: process.env.JWT_SECRET,
    postgres: {
      host: process.env.POSTGRES_HOST,
      port: 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    minio: {
      endPoint: process.env.MINIO_HOST,
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      bucketName: process.env.MINIO_BUCKET_NAME,
      webUrl: process.env.MINIO_WEB_URL,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: 6379,
      password: process.env.REDIS_PASSWORD,
    },
    firebase: {
      config: firebaseConfig,
      serviceAccountKey: serviceAccountKey,
    },
  };
};
