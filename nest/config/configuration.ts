export default () => {
  const isProduction = process.env.ENV !== 'development';
  console.log(`Using ${isProduction ? 'production' : 'development'} setting.`);

  return {
    port: isProduction ? 3000 : 3001,
    baseUrl: isProduction ? '/api/nest' : '',
    mysql: {
      host: isProduction ? 'mysql' : 'localhost',
      port: 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    jwtSecret: process.env.JWT_SECRET,
    minio: {
      endPoint: isProduction ? 'minio' : 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      bucketName: 'uploads',
    },
    minioBaseUrl: isProduction ? '/minio' : '',
  };
};
