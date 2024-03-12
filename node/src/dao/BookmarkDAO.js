import DatabaseConnection from '../db/DatabaseConnection.js';
import Bookmark from '../model/Bookmark.js';

/**
 * @returns {Promise<Bookmark[]>}
 */
async function select() {
    const sql = "SELECT * FROM bookmark";
    const result = await DatabaseConnection.getInstance().getInstance().poolQuery(sql);
    return result.map(row => {
        return new Bookmark({
            id: row.id,
            firstTitle: row.first_title,
            secondTitle: row.second_title,
            url: row.url,
            comment: row.comment
        });
    });
}

/**
 * @param {Bookmark} bookmark
 */
async function insert(bookmark) {
    const sql = "INSERT INTO bookmark (first_title, second_title, url, comment) VALUES (?,?,?,?)";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 bookmark inserted");
}

/**
 * @param {Bookmark} bookmark
 */
async function update(bookmark) {
    const sql = "UPDATE bookmark SET first_title = ?, second_title = ?, url = ?, comment = ? WHERE id = ?";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment, bookmark.id];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 bookmark updated");
}

/**
 * @param {number} id
 */
async function deleteByID(id) {
    const sql = "DELETE FROM bookmark WHERE id = ?";
    const sqlParams = [id];
    await DatabaseConnection.getInstance().poolQuery(sql, sqlParams);
    console.log("1 bookmark deleted");
}

export default {
    select,
    insert,
    update,
    deleteByID
};