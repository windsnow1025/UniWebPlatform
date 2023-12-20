const { poolQuery } = require("./DatabaseConnection");

/**
 * @returns {Promise<Bookmark[]>}
 * @constructor
 */
async function SelectAll() {
    const sql = "SELECT * FROM bookmark";
    return await poolQuery(sql);
}

/**
 * @param {Bookmark} bookmark
 */
async function Insert(bookmark) {
    const sql = "INSERT INTO bookmark (first_title, second_title, url, comment) VALUES (?,?,?,?)";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark inserted");
}

/**
 * @param {number} id
 * @param {Bookmark} bookmark
 */
async function Update(id, bookmark) {
    const sql = "UPDATE bookmark SET first_title = ?, second_title = ?, url = ?, comment = ? WHERE id = ?";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment, id];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark updated");
}

/**
 * @param {number} id
 */
async function Delete(id) {
    const sql = "DELETE FROM bookmark WHERE id = ?";
    const sqlParams = [id];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark deleted");
}

module.exports = {
    SelectAll: SelectAll,
    Insert: Insert,
    Update: Update,
    Delete: Delete
};