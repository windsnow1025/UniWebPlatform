const express = require('express');

const router = express.Router();
const UserSQL = require("./conversation-sql");

const jwt = require('jsonwebtoken');
const axios = require('axios');

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
        // Get user_id from token by user-api
        let username = req.user.sub;
        let user = await axios.post("http://localhost:3000/user", { data: { username: username } });
        let user_id = user.data.id;

        let conversations = await UserSQL.Show(user_id);
        res.status(200).json(conversations);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let data = req.body.data;
        let name = data.name;
        let conversation = data.conversation;

        // Get user_id from token by user-api
        let username = req.user.sub;
        let user = await axios.post("http://localhost:3000/api/user", {
            data: { username: username }
        });
        let user_id = user.data.id;

        let sqlData = {
            user_id: user_id,
            name: name,
            conversation: conversation
        }

        await UserSQL.Store(sqlData);
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



        await UserSQL.Delete(id);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:", err);
        res.status(500).send("Error occurred while deleting data.");
        next(err);
    }
});

module.exports = router;