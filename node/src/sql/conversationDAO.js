const { ConnectionTest, poolQuery } = require("./DatabaseConnection");


ConnectionTest("conversation");


async function Show(data) {
    const sql = "SELECT * FROM conversation WHERE user_id = ?";
    const sqlParams = [data.user_id];
    const result = await poolQuery(sql, sqlParams);
    return result;
}

async function Store(data) {
    const sql = "INSERT INTO conversation (user_id, name, conversation) VALUES (?,?,?)";
    const sqlParams = [data.user_id, data.name, data.conversation];
    await poolQuery(sql, sqlParams);
    console.log("1 conversation inserted");
}

async function Update(data) {
    const sql = "UPDATE conversation SET name = ?, conversation = ? WHERE user_id = ? AND id = ?";
    const sqlParams = [data.name, data.conversation, data.user_id, data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 conversation updated");
}

async function UpdateName(data) {
    const sql = "UPDATE conversation SET name = ? WHERE user_id = ? AND id = ?";
    const sqlParams = [data.name, data.user_id, data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 conversation name updated");
}

async function Delete(data) {
    const sql = "DELETE FROM conversation WHERE user_id = ? AND id = ?";
    const sqlParams = [data.user_id, data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 conversation deleted");
}

module.exports = {
    Show: Show,
    Store: Store,
    Update: Update,
    UpdateName: UpdateName,
    Delete: Delete
};
