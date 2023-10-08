const express = require('express');
const http = require("http");
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
http.createServer(app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
}));

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