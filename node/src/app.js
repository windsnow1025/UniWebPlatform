const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// APIs
const authAPI = require('./api/authRouter');
const userAPI = require('./api/userRouter');
const messageAPI = require('./api/messageRouter');
const bookmarkAPI = require('./api/bookmarkRouter');
const conversationAPI = require('./api/conversationRouter');

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
app.use('/auth', authAPI);
app.use('/user', userAPI);
app.use('/message', messageAPI);
app.use('/bookmark', bookmarkAPI);
app.use('/conversation', conversationAPI);

// SQL
const DatabaseHelper = require('./sql/DatabaseHelper');
const { ConnectionTest } = require('./sql/DatabaseConnection');

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