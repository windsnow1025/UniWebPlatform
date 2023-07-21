const express = require('express');

const router = express.Router();
const UserSQL = require("./conversation-sql");

const jwt = require('jsonwebtoken');

// Data Processing
router.use((req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;

            next();
        });
    } else {
        res.sendStatus(401);
    }
});

router.get('/', async (req, res, next) => {
    try {
        let data = req.body.data;

        // User can only access their own data
        if (req.user.sub != data.username) {
            console.log("req.body", req.body);
            return res.sendStatus(403);
        }

        let conversations = await UserSQL.Show();
        res.json(conversations);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let data = req.body.data;

        // User can only access their own data
        if (req.user.sub != data.username) {
            return res.sendStatus(403);
        }

        await UserSQL.Store(data);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while storing data.");
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        let data = req.body.data;

        // User can only access their own data
        if (req.user.sub != data.username) {
            return res.sendStatus(403);
        }

        await UserSQL.Update(data);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in PUT /:", err);
        res.status(500).send("Error occurred while updating data.");
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        let data = req.body.data;
        let id = req.params.id;

        // User can only access their own data
        if (req.user.sub != data.username) {
            return res.sendStatus(403);
        }

        await UserSQL.Delete(id);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:", err);
        res.status(500).send("Error occurred while deleting data.");
        next(err);
    }
});

module.exports = router;