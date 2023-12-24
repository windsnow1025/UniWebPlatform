const mysql = require("mysql2");
const util = require("util");

// MySQL Connection Pool
const pool = mysql.createPool({
    host: "mysql",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

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