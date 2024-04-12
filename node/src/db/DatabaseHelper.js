class DatabaseHelper {
    constructor(databaseConnection) {
        this.databaseConnection = databaseConnection;
        this.version = '1.2.1';
    }

    CREATE_TABLE_USER = `
        CREATE TABLE IF NOT EXISTS user (
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            username VARCHAR(64) NOT NULL UNIQUE,
            password VARCHAR(64) NOT NULL,
            credit FLOAT NOT NULL DEFAULT 0,
            pin INT
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

    CREATE_TABLE_MARKDOWN = `
        CREATE TABLE IF NOT EXISTS markdown(
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL
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
        await this.databaseConnection.poolQuery(this.CREATE_TABLE_USER);
        await this.databaseConnection.poolQuery(this.CREATE_TABLE_MESSAGE);
        await this.databaseConnection.poolQuery(this.CREATE_TABLE_CONVERSATION);
        await this.databaseConnection.poolQuery(this.CREATE_TABLE_BOOKMARK);
        await this.databaseConnection.poolQuery(this.CREATE_TABLE_MARKDOWN);
        await this.databaseConnection.poolQuery(this.CREATE_TABLE_METADATA);
        await this.databaseConnection.poolQuery(this.INSERT_METADATA);
        console.log('Database created');
    }

    // Change this function for each new version
    async onUpgrade() {
        const ALTER_TABLE_USER_ADD_CREDITS = `
            ALTER TABLE user ADD COLUMN pin FLOAT NOT NULL DEFAULT 0;
        `
        await this.databaseConnection.poolQuery(ALTER_TABLE_USER_ADD_CREDITS);
        console.log('Database upgraded');
    }

    async getDatabaseVersionFromMetadata() {
        try {
            const results = await this.databaseConnection.poolQuery('SELECT version FROM metadata');
            if (results.length === 0) {
                return null;
            }
            return results[0].version;
        } catch (error) {
            console.error("Database version not found");
            return null;
        }
    }

    async setDatabaseVersionInMetadata(version) {
        try {
            await this.databaseConnection.poolQuery('UPDATE metadata SET version = ?', [version]);
        } catch (error) {
            console.error(error);
        }
    }

}

export default DatabaseHelper;