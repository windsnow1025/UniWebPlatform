const mysql = require("mysql2");
const util = require("util");

// MySQL Connection Pool
const pool = mysql.createPool({
    host: global.MYSQL_HOST,
    user: global.MYSQL_USER,
    password: global.MYSQL_PASSWORD,
    database: global.MYSQL_DATABASE,
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