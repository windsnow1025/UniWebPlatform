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
    res.status(500).send("Error occurred while fetching markdowns.");
  }
});

router.get('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let markdown = await MarkdownDAO.Select(id);
    res.status(200).json(markdown);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.status(500).send("Error occurred while fetching markdown.");
  }
});

const rootUser = "windsnow1025@gmail.com";

router.use(async (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    res.sendStatus(401);
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
    res.status(201).send(true);
  } catch (err) {
    console.error("Error in POST /:", err);
    res.status(500).send("Error occurred while storing markdown.");
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
    res.status(200).send(true);
  } catch (err) {
    console.error("Error in PUT /:id:", err);
    res.status(500).send("Error occurred while updating markdown.");
  }
});

router.delete('/:id', async (req, res) => {
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