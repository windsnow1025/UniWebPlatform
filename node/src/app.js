import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import initEnv from './config.js';
import rootAPI from './api/RootRouter.js';
import fileAPI from './api/FileRouter.js';
import bookmarkAPI from './api/BookmarkRouter.js';
import conversationAPI from './api/ConversationRouter.js';
import markdownAPI from './api/MarkdownRouter.js';
import messageAPI from './api/MessageRouter.js';
import userAPI from './api/UserRouter.js';
import DatabaseConnection from './db/DatabaseConnection.js';
import DatabaseHelper from './db/DatabaseHelper.js';

const app = express();

// Environment
initEnv();

// CORS
app.use(cors());

// HTTP
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
});

// support parsing of application/json type post data
app.use(bodyParser.json());

// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

// Routers Notice the .js extension if using type: module 
app.use('/uploads', express.static('uploads'));
app.use('/', rootAPI);
app.use('/file', fileAPI);
app.use('/bookmark', bookmarkAPI);
app.use('/conversation', conversationAPI);
app.use('/markdown', markdownAPI);
app.use('/message', messageAPI);
app.use('/user', userAPI);

async function sql_init() {
    const databaseConnection = new DatabaseConnection();
    const isConnected = await databaseConnection.connectionTest();

    if (isConnected) {
        const databaseHelper = new DatabaseHelper(databaseConnection);
        databaseHelper.manageMigrations();
    } else {
        console.error("Unable to establish a connection to the SQL database.");
    }
}

sql_init();
