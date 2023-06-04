const express = require('express');

const router = express.Router();
const UserSQL = require("./user-sql");

// Data Processing

router.post('/login', async (req, res, next) => {
    try {
        // Get Data
        let data = req.body.data;
        let result = await UserSQL.Show();
        // Judge if data.username and data.password match
        let isLoggedIn = false;
        result.forEach(element => {
            if (data.username == element.username && data.password == element.password) {
                isLoggedIn = true;
                res.send(true);
                next();
            }
        });
        // Response, Next
        if (isLoggedIn == false) {
            res.send(false);
            next();
        }
    } catch (err) {
        console.error("Error in GET /:", err);
        next(err);
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        // Get Data
        let data = req.body.data;
        // Judge if data.username exists
        let result = await UserSQL.Show();
        let dulplication = false;
        result.forEach(element => {
            if (data.username == element.username) {
                dulplication = true;
                res.send(false);
                next();
            }
        });
        if (dulplication == false) {
            // Store Data
            await UserSQL.Store(data);
            // Response, Next
            res.send(true);
            next();
        }
    } catch (err) {
        console.error("Error in POST /:", err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        // Get Data
        let id = req.params.id;
        // Delete Data
        await UserSQL.Delete(id);
        // Response, Next
        res.send(true);
        next();
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        next(err);
    }
});

module.exports = router;