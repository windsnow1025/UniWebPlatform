import * as process from 'node:process';
import * as path from 'node:path';
import * as fs from 'node:fs';

export default () => {
  const isProduction = process.env.ENV !== 'development';
  console.log(`Using ${isProduction ? 'production' : 'development'} setting.`);

  const firebaseConfigPath = isProduction
    ? path.resolve('/app/config', 'firebaseConfig.json')
    : path.resolve(process.cwd(), 'firebaseConfig.json');

  const firebaseConfig = JSON.parse(
    fs.readFileSync(firebaseConfigPath, 'utf8'),
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
    jwtSecret: process.env.JWT_SECRET,
    minio: {
      endPoint: process.env.MINIO_HOST,
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      bucketName: process.env.MINIO_BUCKET_NAME,
      webUrl: process.env.MINIO_WEB_URL,
    },
    firebaseConfig: firebaseConfig,
  };
};
