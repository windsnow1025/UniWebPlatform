const { poolQuery } = require("./DatabaseConnection");


async function SelectAll() {
    const sql = "SELECT * FROM markdown";
    const result = await poolQuery(sql);
    return result;
}

async function Select(data) {
    const sql = "SELECT * FROM markdown WHERE id = ?";
    const sqlParams = [data.id];
    const result = await poolQuery(sql, sqlParams);
    return result;
}

async function Insert(data) {
    const sql = "INSERT INTO markdown (title, content) VALUES (?,?)";
    const sqlParams = [data.title, data.content];
    await poolQuery(sql, sqlParams);
    console.log("1 markdown inserted");
}

async function Update(data) {
    const sql = "UPDATE markdown SET title = ?, content = ? WHERE id = ?";
    const sqlParams = [data.title, data.content, data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 markdown updated");
}


async function Delete(data) {
    const sql = "DELETE FROM markdown WHERE id = ?";
    const sqlParams = [data.id];
    await poolQuery(sql, sqlParams);
    console.log("1 markdown deleted");
}

module.exports = {
    SelectAll: SelectAll,
    Select: Select,
    Insert: Insert,
    Update: Update,
    Delete: Delete
};
