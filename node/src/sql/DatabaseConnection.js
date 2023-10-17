const mysql = require("mysql");
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

async function ConnectionTest(table) {
    let attempts = 0;
    let maxAttempts = 5;
    let delay = 5000;

    await new Promise(resolve => setTimeout(resolve, delay));

    while (true) {
        try {
            await poolQuery('SELECT * FROM ' + table);
            console.log(table + 'SQL Connected!');
            break;
        } catch (err) {
            console.error('Error connecting to ' + table + 'SQL:', err);
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`Attempts ${attempts + 1},Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Max attempts reached. ' + table + 'SQL connection failed.');
                throw err;
            }
        }
    }
}

module.exports = {
    poolQuery: poolQuery,
    ConnectionTest: ConnectionTest,
}