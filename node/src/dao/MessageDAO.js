import DatabaseConnection from '../db/DatabaseConnection.js';

/**
 * @returns {Promise<Message>}
 */
async function selectAll() {
    const sql = "SELECT * FROM message";
    return await DatabaseConnection.poolQuery(sql);
}

/**
 * @param {Message} message
 */
async function insert(message) {
    const sql = "INSERT INTO message (username, content) VALUES (?,?)";
    const sqlParams = [message.username, message.content];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 message inserted");
}

/**
 * @param {number} id
 */
async function deleteById(id) {
    const sql = "DELETE FROM message WHERE id = ?";
    const sqlParams = [id];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 message deleted");
}

async function deleteAll() {
    const sql = "DELETE FROM message";
    const result = await DatabaseConnection.poolQuery(sql);
    console.log("Number of messages deleted: " + result.affectedRows);
}

export default {
    selectAll,
    insert,
    deleteById,
    deleteAll
};