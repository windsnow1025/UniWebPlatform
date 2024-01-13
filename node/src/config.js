const fs = require('fs');
const path = require('path');

function loadConfigFromFile() {
  const configPath = path.join(__dirname, 'config.json');
  const configFile = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configFile);
}

if (process.env.JWT_SECRET && process.env.MYSQL_ROOT_PASSWORD && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE) {
  process.env.PORT = 3000;
  process.env.BASE_URL = "/api";
  process.env.MYSQL_HOST = "mysql";

  console.log("Using production setting.")
} else {
  const config = loadConfigFromFile();

  process.env.PORT = 3001;
  process.env.BASE_URL = "";
  process.env.JWT_SECRET = config.JWT_SECRET;
  process.env.MYSQL_HOST = "localhost";
  process.env.MYSQL_ROOT_PASSWORD = config.MYSQL_ROOT_PASSWORD;
  process.env.MYSQL_USER = config.MYSQL_USER;
  process.env.MYSQL_PASSWORD = config.MYSQL_PASSWORD;
  process.env.MYSQL_DATABASE = config.MYSQL_DATABASE;

  console.log("Using development setting.")
}

