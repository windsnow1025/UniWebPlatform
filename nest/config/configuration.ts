import * as process from 'node:process';

export default () => {
  const isProduction = process.env.ENV !== 'development';
  console.log(`Using ${isProduction ? 'production' : 'development'} setting.`);

  return {
    port: isProduction ? 3000 : 3001,
    baseUrl: isProduction ? '/api/nest' : '',
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
    },
    minioBaseUrl: isProduction ? '/minio' : '',
  };
};
