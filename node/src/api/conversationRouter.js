const express = require('express');
const router = express.Router();
const ConversationDAO = require("../sql/conversationDAO");
const jwt = require('jsonwebtoken');
const axios = require('axios');


router.use(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            // Get username from token
            const username = await jwt.verify(token, process.env.JWT_SECRET).sub;

            // Get user_id from username
            const user = await axios.get("http://localhost:3000/user?username=" + username);

            // Set req.user_id
            req.user_id = user.data.id;
            next();
        } catch (err) {
            res.sendStatus(403);
        }

    } else {
        res.sendStatus(401);
    }
});

router.get('/', async (req, res, next) => {
    try {
        let conversations = await ConversationDAO.Select({
            user_id: req.user_id
        });
        res.status(200).json(conversations);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
    }
});

router.post('/', async (req, res, next) => {
    try {
        let data = req.body.data;
        let name = data.name;
        let conversation = data.conversation;

        let sqlData = {
            user_id: req.user_id,
            name: name,
            conversation: conversation
        }

        await ConversationDAO.Insert(sqlData);
        res.status(201).send(true);
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while storing data.");
    }
});

router.put('/', async (req, res, next) => {
    try {
        let data = req.body.data;
        let name = data.name;
        let conversation = data.conversation;
        let id = data.id;

        let sqlData = {
            user_id: req.user_id,
            name: name,
            conversation: conversation,
            id: id
        }

        await ConversationDAO.Update(sqlData);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in PUT /:", err);
        res.status(500).send("Error occurred while updating data.");
    }
});

router.put('/name', async (req, res, next) => {
    try {
        let data = req.body.data;
        let name = data.name;
        let id = data.id;

        let sqlData = {
            user_id: req.user_id,
            name: name,
            id: id
        }

        await ConversationDAO.UpdateName(sqlData);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in PUT /name:", err);
        res.status(500).send("Error occurred while updating data.");
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        let sqlData = {
            user_id: req.user_id,
            id: id
        }

        await ConversationDAO.Delete(sqlData);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        res.status(500).send("Error occurred while deleting data.");
    }
});

module.exports = router;