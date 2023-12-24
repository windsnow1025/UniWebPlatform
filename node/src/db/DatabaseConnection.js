const mysql = require("mysql2");
const util = require("util");
const fs = require("fs");
const path = require("path");

// MySQL Configuration
function getConfig() {
    if (process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE) {
        return {
            host: "mysql",
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        };
    } else {
        const configPath = path.join(__dirname, "config.json");
        const configFile = fs.readFileSync(configPath, "utf8");
        return JSON.parse(configFile);
    }
}

// MySQL Connection Pool
const config = getConfig();
const pool = mysql.createPool(config);

// MySQL Promisify
const poolQuery = util.promisify(pool.query).bind(pool);

async function connectionTest() {
    let delay = 1000;

    while (true) {
        try {
            await new Promise(resolve => setTimeout(resolve, delay));
            await poolQuery('SELECT 1');
            console.log('SQL Connected');
            return true;
        } catch (err) {
            console.info('SQL Unconnected');
        }
    }
}

module.exports = {
    poolQuery: poolQuery,
    connectionTest: connectionTest,
}