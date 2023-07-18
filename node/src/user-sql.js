const mysql = require("mysql");
const util = require("util");

// MySQL Connection Pool
const pool = mysql.createPool({
    host: "sql",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// MySQL Promisify
const poolQuery = util.promisify(pool.query).bind(pool);

// MySQL Connection Test
async function testConnection() {
    let attempts = 0;
    let maxAttempts = 5;
    let delay = 5000;

    await new Promise(resolve => setTimeout(resolve, delay));

    while (true) {
        try {
            await poolQuery('SELECT * FROM users');
            console.log('UserSQL Connected!');
            break;
        } catch (err) {
            console.error('Error connecting to UserSQL:', err);
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`Attempts ${attempts + 1},Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Max attempts reached. UserSQL connection failed.');
                throw err;
            }
        }
    }
}

testConnection();

// MySQL Functions

async function Show() {
    const sql = "SELECT * FROM users";
    const result = await poolQuery(sql);
    return result;
}

async function Store(data) {
    const sql = "INSERT INTO users (username, password) VALUES (?,?)";
    const sqlParams = [data.username, data.password];
    await poolQuery(sql, sqlParams);
    console.log("1 record inserted");
}

async function Delete(id) {
    const sql = "DELETE FROM users WHERE id = ?";
    const sqlParams = [id];
    await poolQuery(sql, sqlParams);
    console.log("1 record deleted");
}

module.exports = {
    Show: Show,
    Store: Store,
    Delete: Delete
};
