const express = require('express');
const router = express.Router();
const BookmarkSQL = require("./bookmark-sql");
const jwt = require('jsonwebtoken');

router.get('/', async (req, res, next) => {
    try {
        let bookmarks = await BookmarkSQL.Show();
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
        await BookmarkSQL.Store(data);
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
        await BookmarkSQL.Update(id, data);
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