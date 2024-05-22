export default () => {
  const isProduction = process.env.ENV !== "development";

  return {
    port: isProduction ? 3000 : 3001,
    baseUrl: isProduction ? '/api' : '',
    mysql: {
      host: isProduction ? 'mysql' : 'localhost',
      rootPassword: process.env.MYSQL_ROOT_PASSWORD,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    jwtSecret: process.env.JWT_SECRET,
  };
};