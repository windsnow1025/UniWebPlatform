const express = require('express');

const router = express.Router();
const UserSQL = require("./user-sql");

const jwt = require('jsonwebtoken');

// Data Processing

router.post('/login', async (req, res, next) => {
    try {
        let data = req.body.data;
        let result = await UserSQL.Match(data);
        if (result.length > 0) {
            // Generate token
            const token = jwt.sign({sub: data.username}, process.env.JWT_SECRET, {expiresIn: '72h'});
            res.status(200).json({token});
            next();
        } else {
            res.status(401).send("Invalid Username or Password");
            next();
        }
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
});

router.post('/signup', async (req, res, next) => {

    try {
        let data = req.body.data;
        let sqlData = {username: data.username};

        // Judge if data.username exists
        let result = await UserSQL.Exist(sqlData);
        if (result.length > 0) {
            res.status(401).send("Username already exists");
            next();
        } else {
            // Store Data
            await UserSQL.Store(data);
            // Response, Next
            res.status(200).send(true);
            next();
        }
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while storing data.");
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
        res.status(200).send(true);
        next();
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        res.status(500).send("Error occurred while deleting data.");
        next(err);
    }
});

module.exports = router;