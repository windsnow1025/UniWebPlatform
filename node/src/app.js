const express = require('express');
const bodyParser = require('body-parser');

const app = express();


// HTTP
const port = 3000;
app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
});


// support parsing of application/json type post data
app.use(bodyParser.json());

// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));


// Routers
const authAPI = require('./api/AauthRouter');
const bookmarkAPI = require('./api/BbookmarkRouter');
const conversationAPI = require('./api/CconversationRouter');
const markdownAPI = require('./api/MmarkdownRouter');
const messageAPI = require('./api/MmessageRouter');
const userAPI = require('./api/UuserRouter');
app.use('/auth', authAPI);
app.use('/bookmark', bookmarkAPI);
app.use('/conversation', conversationAPI);
app.use('/markdown', markdownAPI);
app.use('/message', messageAPI);
app.use('/user', userAPI);


// SQL
const DatabaseHelper = require('./db/DatabaseHelper');
const { ConnectionTest } = require('./db/DatabaseConnection');

async function sql_init() {
    const isConnected = await ConnectionTest();

    if (isConnected) {
        const databaseHelper = new DatabaseHelper();
        databaseHelper.manageMigrations();
    } else {
        console.error("Unable to establish a connection to the SQL database.");
    }
}

sql_init();