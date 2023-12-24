require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


// HTTP
const port = global.PORT;
app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
});


// CORS
app.use(cors());

// support parsing of application/json type post data
app.use(bodyParser.json());

// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));


// Routers
const authAPI = require('./api/AuthRouter');
const bookmarkAPI = require('./api/BookmarkRouter');
const conversationAPI = require('./api/ConversationRouter');
const markdownAPI = require('./api/MarkdownRouter');
const messageAPI = require('./api/MessageRouter');
const userAPI = require('./api/UserRouter');
app.use('/auth', authAPI);
app.use('/bookmark', bookmarkAPI);
app.use('/conversation', conversationAPI);
app.use('/markdown', markdownAPI);
app.use('/message', messageAPI);
app.use('/user', userAPI);


// Root Router
app.get('/', (req, res) => {
    res.send('Node.js');
});


// SQL
const DatabaseHelper = require('./db/DatabaseHelper');
const { connectionTest } = require('./db/DatabaseConnection');

async function sql_init() {
    const isConnected = await connectionTest();

    if (isConnected) {
        const databaseHelper = new DatabaseHelper();
        databaseHelper.manageMigrations();
    } else {
        console.error("Unable to establish a connection to the SQL database.");
    }
}

sql_init();