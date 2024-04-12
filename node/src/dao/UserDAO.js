import DatabaseConnection from '../db/DatabaseConnection.js';

async function selectByUsernamePassword(username, password) {
    const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    const sqlParams = [username, password];
    return await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
}

async function selectIdByUsername(username) {
    const sql = "SELECT id FROM user WHERE username = ?";
    const sqlParams = [username];
    const result = await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    if (result.length === 0) {
        return null;
    }
    return result[0].id;
}

async function insert(username, password) {
    const sql = "INSERT INTO user (username, password) VALUES (?,?)";
    const sqlParams = [username, password];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 user inserted");
}

async function update(id, username, password) {
    const sql = "UPDATE user SET username = ?, password = ? WHERE id = ?";
    const sqlParams = [username, password, id];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 user updated");
}

async function deleteByUsername(username) {
    const sql = "DELETE FROM user WHERE username = ?";
    const sqlParams = [username];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 user deleted");
}

async function selectCreditByUsername(username) {
    const sql = "SELECT credit FROM user WHERE username = ?";
    const sqlParams = [username];
    const result = await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    return result[0].credit;
}

async function selectPinByUsername(username) {
    const sql = "SELECT pin FROM user WHERE username = ?";
    const sqlParams = [username];
    const result = await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    return result[0].pin;
}

async function updatePinByUsername(pin, username) {
    const sql = "UPDATE user SET pin = ? WHERE username = ?";
    const sqlParams = [pin, username];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("Pin inserted");
}

export default {
    selectByUsernamePassword,
    selectIdByUsername,
    insert,
    update,
    deleteByUsername,
    selectCreditByUsername,
    selectPinByUsername,
    updatePinByUsername
};