const mysql = require("mysql2");
const util = require("util");

class DatabaseConnection {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
    }

    async poolQuery(sql, params) {
        const query = util.promisify(this.pool.query.bind(this.pool));
        return await query(sql, params);
    }

    async connectionTest() {
        let delay = 1000;

        while (true) {
            try {
                await new Promise(resolve => setTimeout(resolve, delay));
                await this.poolQuery('SELECT 1');
                console.log('SQL Connected');
                return true;
            } catch (err) {
                console.info('SQL Unconnected');
            }
        }
    }
}

module.exports = new DatabaseConnection();
