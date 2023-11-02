const express = require('express');
const router = express.Router();
const MessageDAO = require("../sql/messageDAO");


router.get('/', async (req, res, next) => {
    try {
        let data = await MessageDAO.SelectAll();
        res.status(200).json(data);
    } catch (err) {
        console.error("Error in GET /:", err);
        res.status(500).send("Error occurred while fetching data.");
    }
})

router.post('/', async (req, res, next) => {
    try {
        let data = req.body.data;
        await MessageDAO.Insert(data);
        res.status(201).send(true);
    } catch (err) {
        console.error("Error in POST /:", err);
        res.status(500).send("Error occurred while storing data.");
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await MessageDAO.Delete(id);
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:id:", err);
        res.status(500).send("Error occurred while deleting data.");
    }
})

router.delete('/', async (req, res, next) => {
    try {
        await MessageDAO.DeleteAll();
        res.status(200).send(true);
    } catch (err) {
        console.error("Error in DELETE /:", err);
        res.status(500).send("Error occurred while deleting all data.");
    }
})

module.exports = router;