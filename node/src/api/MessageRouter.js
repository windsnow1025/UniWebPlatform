const express = require('express');
const router = express.Router();
const MessageDAO = require("../dao/MessageDAO");


router.get('/', async (req, res) => {
  try {
    let data = await MessageDAO.SelectAll();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.sendStatus(500);
  }
})

router.post('/', async (req, res) => {
  try {
    let data = req.body;
    await MessageDAO.Insert(data);
    res.sendStatus(201);
  } catch (err) {
    console.error("Error in POST /:", err);
    res.sendStatus(500);
  }
})

router.delete('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    await MessageDAO.Delete(id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.sendStatus(500);
  }
})

router.delete('/', async (req, res) => {
  try {
    await MessageDAO.DeleteAll();
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:", err);
    res.sendStatus(500);
  }
})

module.exports = router;