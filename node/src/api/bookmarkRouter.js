const express = require('express');
const router = express.Router();
const BookmarkSQL = require("../sql/bookmarkDAO");
const jwt = require('jsonwebtoken');

const Bookmark = require("../object/bookmark");

router.get('/', async (req, res, next) => {
    try {
        let bookmarks = await BookmarkSQL.SelectAll();
        res.status(200).json(bookmarks);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
        next(err);
    }
});

const rootUser = "windsnow1025@gmail.com";

router.use((req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;

            // Only allow root user to access
            if (req.user.sub != rootUser) {
                return res.sendStatus(403);
            }

            next();
        });
    } else {
        res.sendStatus(401);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let data = req.body.data;
        let bookmark = new Bookmark(data.firstTitle, data.secondTitle, data.url, data.comment);
        await BookmarkSQL.Insert(bookmark);
        res.status(201).send(true);
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while storing data.");
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = req.body.data;
        let bookmark = new Bookmark(data.firstTitle, data.secondTitle, data.url, data.comment);
        await BookmarkSQL.Update(id, bookmark);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in PUT /:id:", err);
        res.status(500).send("Error occurred while updating data.");
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await BookmarkSQL.Delete(id);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        res.status(500).send("Error occurred while deleting data.");
    }
});

module.exports = router;