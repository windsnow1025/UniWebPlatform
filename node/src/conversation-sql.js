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

async function Show(data) {
    const sql = "SELECT * FROM conversations WHERE user_id = ?";
    const sqlParams = [data.user_id];
    const result = await poolQuery(sql, sqlParams);
    return result;
}

async function Store(data) {
    const sql = "INSERT INTO conversations (user_id, name, conversation) VALUES (?,?,?)";
    const sqlParams = [data.user_id, data.name, data.conversation];
    await poolQuery(sql, sqlParams);
    console.log("1 conversation inserted");
}

async function Update(data) {
    const sql = "UPDATE conversations SET name = ?, conversation = ? WHERE user_id = ? AND id = ?";
    const sqlParams = [data.name, data.conversation, data.user_id, data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 conversation updated");
}

async function Delete(data) {
    const sql = "DELETE FROM conversations WHERE user_id = ? AND id = ?";
    const sqlParams = [data.user_id, data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 conversation deleted");
}

module.exports = {
    Show: Show,
    Store: Store,
    Update: Update,
    Delete: Delete
};
