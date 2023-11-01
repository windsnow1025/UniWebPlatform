const { poolQuery } = require("./DatabaseConnection");

class DatabaseHelper {
    constructor() {
        this.version = '1.0';
    }

    CREATE_TABLE_USER = `
        CREATE TABLE IF NOT EXISTS user (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            username VARCHAR(64) NOT NULL UNIQUE,
            password VARCHAR(64) NOT NULL
        );
    `

    CREATE_TABLE_MESSAGE = `
        CREATE TABLE IF NOT EXISTS message (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            username VARCHAR(64) NOT NULL,
            content TEXT NOT NULL
        );
    `

    CREATE_TABLE_CONVERSATION = `
        CREATE TABLE IF NOT EXISTS conversation(
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            conversation JSON NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user(id)
        );
    `

    CREATE_TABLE_BOOKMARK = `
        CREATE TABLE IF NOT EXISTS bookmark(
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            first_title VARCHAR(255) NOT NULL,
            second_title VARCHAR(255) NOT NULL,
            url VARCHAR(255) NOT NULL,
            comment TEXT NOT NULL
        );
    `

    CREATE_TABLE_METADATA = `
        CREATE TABLE IF NOT EXISTS metadata(
            version VARCHAR(16) NOT NULL
        );
    `

    INSERT_METADATA = `
        INSERT INTO metadata (version) VALUES (0);
    `

    async manageMigrations() {
        const dbVersion = await this.getDatabaseVersionFromMetadata();
        if (!dbVersion) {
            await this.onCreate(); // Initialize database version to 0
            await this.setDatabaseVersionInMetadata(this.version);
        } else if (dbVersion !== this.version) {
            await this.onUpgrade();
            await this.setDatabaseVersionInMetadata(this.version);
        }
    }

    async onCreate() {
        await poolQuery(this.CREATE_TABLE_USER);
        await poolQuery(this.CREATE_TABLE_MESSAGE);
        await poolQuery(this.CREATE_TABLE_CONVERSATION);
        await poolQuery(this.CREATE_TABLE_BOOKMARK);
        await poolQuery(this.CREATE_TABLE_METADATA);
        await poolQuery(this.INSERT_METADATA);
        console.log('Database created');
    }

    async onUpgrade() {
        await poolQuery(this.CREATE_TABLE_METADATA);
        console.log('Database upgraded');
    }

    async getDatabaseVersionFromMetadata() {
        try {
            const results = await poolQuery('SELECT version FROM metadata');
            if (results.length === 0) {
                return null;
            }
            return results[0].version;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async setDatabaseVersionInMetadata(version) {
        try {
            await poolQuery('UPDATE metadata SET version = ?', [version]);
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = DatabaseHelper;
