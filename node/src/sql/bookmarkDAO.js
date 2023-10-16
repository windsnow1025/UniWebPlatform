const { testConnection } = require("./test-connection");

const mysql = require("mysql");
const util = require("util");

// MySQL Connection Pool
const pool = mysql.createPool({
    host: "mysql",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// MySQL Promisify
const poolQuery = util.promisify(pool.query).bind(pool);

// MySQL Connection Test
testConnection("bookmark");

// MySQL Functions

async function Show() {
    const sql = "SELECT * FROM bookmark";
    const result = await poolQuery(sql);
    return result;
}

async function Store(bookmark) {
    const sql = "INSERT INTO bookmark (first_title, second_title, url, comment) VALUES (?,?,?,?)";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark inserted");
}

async function Update(id, bookmark) {
    const sql = "UPDATE bookmark SET first_title = ?, second_title = ?, url = ?, comment = ? WHERE id = ?";
    const sqlParams = [bookmark.firstTitle, bookmark.secondTitle, bookmark.url, bookmark.comment, id];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark updated");
}

async function Delete(id) {
    const sql = "DELETE FROM bookmark WHERE id = ?";
    const sqlParams = [id];
    await poolQuery(sql, sqlParams);
    console.log("1 bookmark deleted");
}

module.exports = {
    Show: Show,
    Store: Store,
    Update: Update,
    Delete: Delete
};