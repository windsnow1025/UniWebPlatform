const express = require('express');
const router = express.Router();
const MarkdownDAO = require("../sql/markdownDAO");
const jwt = require('jsonwebtoken');


router.get('/', async (req, res, next) => {
    try {
        let markdowns = await MarkdownDAO.SelectAll();
        res.status(200).json(markdowns);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let markdown = await MarkdownDAO.Select(id);
        res.status(200).json(markdown);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
});

const rootUser = "windsnow1025@gmail.com";

router.use(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const username = await jwt.verify(token, process.env.JWT_SECRET).sub;
        if (username != rootUser) {
            return res.sendStatus(403);
        }
        next();
    } catch (err) {
        res.sendStatus(403);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let data = req.body.data;
        await MarkdownDAO.Insert(data);
        res.status(201).send(true);
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while storing data.");
    }
});

router.put('/', async (req, res, next) => {
    try {
        let data = req.body.data;
        let sqlData = {
            id: data.id,
            title: data.title,
            content: data.content
        }

        await MarkdownDAO.Update(sqlData);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in PUT /:id:", err);
        res.status(500).send("Error occurred while updating data.");
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await MarkdownDAO.Delete(id);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        res.status(500).send("Error occurred while deleting data.");
    }
});

module.exports = router;