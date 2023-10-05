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

// MySQL Connection Test
async function testConnection() {
    let attempts = 0;
    let maxAttempts = 5;
    let delay = 5000;

    await new Promise(resolve => setTimeout(resolve, delay));
    
    while (true) {
        try {
            await poolQuery('SELECT * FROM bookmark');
            console.log('BookmarkSQL Connected!');
            break;
        } catch (err) {
            console.error('Error connecting to BookmarkSQL:', err);
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`Attempts ${attempts + 1},Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Max attempts reached. BookmarkSQL connection failed.');
                throw err;
            }
        }
    }
}

testConnection();

// MySQL Functions

async function Show() {
    const sql = "SELECT * FROM bookmark";
    const result = await poolQuery(sql);
    return result;
}

async function Store(data) {
    const sql = "INSERT INTO bookmark (first_title, second_title, url, comment) VALUES (?,?,?,?)";
    const sqlParams = [data.firstTitle, data.secondTitle, data.url, data.comment];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark inserted");
}

async function Update(id, data) {
    const sql = "UPDATE bookmark SET first_title = ?, second_title = ?, url = ?, comment = ? WHERE id = ?";
    const sqlParams = [data.firstTitle, data.secondTitle, data.url, data.comment, id];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark updated");
}

async function Delete(id) {
    const sql = "DELETE FROM bookmark WHERE id = ?";
    const sqlParams = [id];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark deleted");
}

module.exports = {
    Show: Show,
    Store: Store,
    Update: Update,
    Delete: Delete
};