const express = require('express');
const http = require("http");

const app = express();


// HTTP
const port = 3000;
http.createServer(app.listen(port, () => {
    console.log(`Server listening at port ${port}...`);
}));


// Serve Static Files
app.use(express.static('public'));
app.use(express.static('dist'));

