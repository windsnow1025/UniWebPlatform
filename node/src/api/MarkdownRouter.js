const express = require('express');
const router = express.Router();
const MarkdownDAO = require("../dao/MarkdownDAO");
const jwt = require('jsonwebtoken');


router.get('/', async (req, res) => {
  try {
    let markdowns = await MarkdownDAO.SelectAll();
    res.status(200).json(markdowns);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let markdown = await MarkdownDAO.Select(id);
    res.status(200).json(markdown);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.sendStatus(500);
  }
});

const rootUser = "windsnow1025@gmail.com";

router.use(async (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const username = await jwt.verify(token, process.env.JWT_SECRET).sub;
    if (username !== rootUser) {
      return res.sendStatus(403);
    }
    next();
  } catch (err) {
    res.sendStatus(403);
  }
});

router.post('/', async (req, res) => {
  try {
    let data = req.body;
    await MarkdownDAO.Insert(data);
    res.sendStatus(201);
  } catch (err) {
    console.error("Error in POST /:", err);
    res.sendStatus(500);
  }
});

router.put('/', async (req, res) => {
  try {
    let data = req.body;
    let sqlData = {
      id: data.id,
      title: data.title,
      content: data.content
    }

    await MarkdownDAO.Update(sqlData);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in PUT /:id:", err);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    await MarkdownDAO.Delete(id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.sendStatus(500);
  }
});

module.exports = router;