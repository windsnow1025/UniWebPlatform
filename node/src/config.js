import dotenv from 'dotenv';

export default function initEnv() {
  dotenv.config();
  const isProduction = process.env.ENV !== 'development';

  process.env.PORT = isProduction ? 3000 : 3001;
  process.env.MYSQL_HOST = isProduction ? 'mysql' : "localhost";
  process.env.BASE_URL = isProduction ? '/api/node' : '';

  console.log(`Using ${isProduction ? 'production' : 'development'} setting.`);
}
