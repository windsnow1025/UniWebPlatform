const express = require('express');
const router = express.Router();
const MarkdownDAO = require("../dao/MarkdownDAO");
const JWT = require("../logic/JWT");


router.get('/', async (req, res) => {
  try {
    const markdowns = await MarkdownDAO.selectAll();
    res.status(200).json(markdowns);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const param = req.params;

    const markdown = await MarkdownDAO.selectById(param.id);
    res.status(200).json(markdown);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.sendStatus(500);
  }
});

router.use(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(401);
  }

  const username = await JWT.getUsernameFromToken(token, "admin");
  if (!username) {
    return res.sendStatus(403);
  }
  next();
});

router.post('/', async (req, res) => {
  try {
    const markdown = req.body;
    await MarkdownDAO.insert(markdown);
    res.sendStatus(201);
  } catch (err) {
    console.error("Error in POST /:", err);
    res.sendStatus(500);
  }
});

router.put('/', async (req, res) => {
  try {
    const markdown = req.body;
    await MarkdownDAO.update(markdown);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in PUT /:id:", err);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const param = req.params;
    await MarkdownDAO.deleteById(param.id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.sendStatus(500);
  }
});

module.exports = router;