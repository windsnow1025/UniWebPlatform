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
    mysql: {
      host: process.env.MYSQL_HOST,
      port: 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
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
    jwtSecret: process.env.JWT_SECRET,
    firebaseConfig: firebaseConfig,
    serviceAccountKey: serviceAccountKey,
  };
};
