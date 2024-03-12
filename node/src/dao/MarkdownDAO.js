import DatabaseConnection from '../db/DatabaseConnection.js';

/**
 * @returns {Promise<Markdown[]>}
 */
async function selectAll() {
    const sql = "SELECT * FROM markdown";
    return await DatabaseConnection.poolQuery(sql);
}

/**
 * @param {number} id
 * @returns {Promise<Markdown>}
 */
async function selectById(id) {
    const sql = "SELECT * FROM markdown WHERE id = ?";
    const sqlParams = [id];
    const result = await DatabaseConnection.poolQuery(sql, sqlParams);
    return result[0];
}

/**
 * @param {Markdown} markdown
 */
async function insert(markdown) {
    const sql = "INSERT INTO markdown (title, content) VALUES (?,?)";
    const sqlParams = [markdown.title, markdown.content];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 markdown inserted");
}

/**
 * @param {Markdown} markdown
 */
async function update(markdown) {
    const sql = "UPDATE markdown SET title = ?, content = ? WHERE id = ?";
    const sqlParams = [markdown.title, markdown.content, markdown.id];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 markdown updated");
}

/**
 * @param {number} id
 */
async function deleteById(id) {
    const sql = "DELETE FROM markdown WHERE id = ?";
    const sqlParams = [id];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 markdown deleted");
}

export default {
    selectAll,
    selectById,
    insert,
    update,
    deleteById
};