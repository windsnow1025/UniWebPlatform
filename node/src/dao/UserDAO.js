const { poolQuery } = require("../db/DatabaseConnection");


async function SelectByUsernamePassword(data) {
    const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    const sqlParams = [data.username, data.password];
    const result = await poolQuery(sql, sqlParams);
    return result;
}

async function SelectByUsername(data) {
    const sql = "SELECT * FROM user WHERE username = ?";
    const sqlParams = [data.username];
    const result = await poolQuery(sql, sqlParams);
    return result;
}

async function SelectCreditByUsername(data) {
    const sql = "SELECT credit FROM user WHERE username = ?";
    const sqlParams = [data.username];
    const result = await poolQuery(sql, sqlParams);
    return result;
}

async function UpdateCreditByUsername(data) {
    const sql = "UPDATE user SET credit = ? WHERE username = ?";
    const sqlParams = [data.credit, data.username];
    await poolQuery(sql, sqlParams);
    console.log("1 user credit updated");
}

async function Insert(data) {
    const sql = "INSERT INTO user (username, password) VALUES (?,?)";
    const sqlParams = [data.username, data.password];
    await poolQuery(sql, sqlParams);
    console.log("1 user inserted");
}

async function Update(data) {
    const sql = "UPDATE user SET username = ?, password = ? WHERE id = ?";
    const sqlParams = [data.username, data.password, data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 user updated");
}

async function Delete(id) {
    const sql = "DELETE FROM user WHERE id = ?";
    const sqlParams = [id];
    await poolQuery(sql, sqlParams);
    console.log("1 user deleted");
}

module.exports = {
    SelectByUsernamePassword: SelectByUsernamePassword,
    SelectByUsername: SelectByUsername,
    SelectCreditByUsername: SelectCreditByUsername,
    UpdateCreditByUsername: UpdateCreditByUsername,
    Insert: Insert,
    Update: Update,
    Delete: Delete
};
