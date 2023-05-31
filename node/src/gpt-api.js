const express = require('express');

const router = express.Router();

// Data Processing

router.get('/', async (req, res, next) => {
    res.send("Hello World!");
    next();
});

router.post('/:username', async (req, res, next) => {
    try {
        const username = req.params.username;
        console.log("username: ", username);
        res.send(true);
        next();
    } catch {
        console.error("Error in POST /:username:", err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    res.send(true);
    next();
});

module.exports = router;