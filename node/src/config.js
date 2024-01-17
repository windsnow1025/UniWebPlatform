if (process.env.JWT_SECRET && process.env.MYSQL_ROOT_PASSWORD && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE) {
  process.env.PORT = 3000;
  process.env.BASE_URL = "/api";
  process.env.MYSQL_HOST = "mysql";

  console.log("Using production setting.")
} else {
  require('dotenv').config();

  process.env.PORT = 3001;
  process.env.BASE_URL = "";
  process.env.MYSQL_HOST = "localhost";

  console.log("Using development setting.")
}

