const DatabaseConnection = require('../db/DatabaseConnection');

async function SelectAll() {
    const sql = "SELECT * FROM message";
    const result = await DatabaseConnection.poolQuery(sql);
    return result;
}

async function Insert(message) {
    const sql = "INSERT INTO message (username, content) VALUES (?,?)";
    const sqlParams = [message.username, message.content];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 message inserted");
}

async function Delete(id) {
    const sql = "DELETE FROM message WHERE id = ?";
    const sqlParams = [id];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 message deleted");
}

async function DeleteAll() {
    const sql = "DELETE FROM message";
    const result = await DatabaseConnection.poolQuery(sql);
    console.log("Number of messages deleted: " + result.affectedRows);
}

module.exports = {
    SelectAll: SelectAll,
    Insert: Insert,
    Delete: Delete,
    DeleteAll: DeleteAll
};