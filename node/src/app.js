require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


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


// Routers
const rootAPI = require('./api/RootRouter');
const bookmarkAPI = require('./api/BookmarkRouter');
const conversationAPI = require('./api/ConversationRouter');
const markdownAPI = require('./api/MarkdownRouter');
const messageAPI = require('./api/MessageRouter');
const userAPI = require('./api/UserRouter');
app.use('/', rootAPI);
app.use('/bookmark', bookmarkAPI);
app.use('/conversation', conversationAPI);
app.use('/markdown', markdownAPI);
app.use('/message', messageAPI);
app.use('/user', userAPI);


// SQL
const DatabaseConnection = require('./db/DatabaseConnection');
const DatabaseHelper = require('./db/DatabaseHelper');

async function sql_init() {
    const isConnected = await DatabaseConnection.connectionTest();

    if (isConnected) {
        const databaseHelper = new DatabaseHelper(DatabaseConnection);
        databaseHelper.manageMigrations();
    } else {
        console.error("Unable to establish a connection to the SQL database.");
    }
}

sql_init();