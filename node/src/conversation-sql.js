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
            await poolQuery('SELECT * FROM conversations');
            console.log('ConversationSQL Connected!');
            break;
        } catch (err) {
            console.error('Error connecting to ConversationSQL:', err);
            attempts++;
            if (attempts < maxAttempts) {
                console.log(`Attempts ${attempts + 1},Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Max attempts reached. ConversationSQL connection failed.');
                throw err;
            }
        }
    }
}

testConnection();

// MySQL Functions

async function Show() {
    const sql = "SELECT * FROM conversations";
    const result = await poolQuery(sql);
    return result;
}

async function Store(data) {
    const sql = "INSERT INTO conversations (user_id, name, conversation) VALUES (?,?,?)";
    const sqlParams = [data.user_id, data.name, data.conversation];
    await poolQuery(sql, sqlParams);
    console.log("1 record inserted");
}

async function Update(data) {
    const sql = "UPDATE conversations SET name = ?, conversation = ? WHERE id = ?";
    const sqlParams = [data.name, data.conversation, data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 record updated");
}

async function Delete(id) {
    const sql = "DELETE FROM conversations WHERE id = ?";
    const sqlParams = [id];
    await poolQuery(sql, sqlParams);
    console.log("1 record deleted");
}

module.exports = {
    Show: Show,
    Store: Store,
    Update: Update,
    Delete: Delete
};
