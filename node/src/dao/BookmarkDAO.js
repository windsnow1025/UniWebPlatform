const DatabaseConnection = require('../db/DatabaseConnection');

/**
 * @returns {Promise<Bookmark[]>}
 */
async function select() {
    const sql = "SELECT * FROM bookmark";
    return await DatabaseConnection.poolQuery(sql);
}

/**
 * @param {Bookmark} bookmark
 */
async function insert(bookmark) {
    const sql = "INSERT INTO bookmark (first_title, second_title, url, comment) VALUES (?,?,?,?)";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 bookmark inserted");
}

/**
 * @param {Bookmark} bookmark
 */
async function update(bookmark) {
    const sql = "UPDATE bookmark SET first_title = ?, second_title = ?, url = ?, comment = ? WHERE id = ?";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment, bookmark.id];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 bookmark updated");
}

/**
 * @param {number} id
 */
async function deleteByID(id) {
    const sql = "DELETE FROM bookmark WHERE id = ?";
    const sqlParams = [id];
    await DatabaseConnection.poolQuery(sql, sqlParams);
    console.log("1 bookmark deleted");
}

module.exports = {
    select: select,
    insert: insert,
    update: update,
    deleteByID: deleteByID
};