const express = require('express');
const router = express.Router();
const BookmarkDAO = require("../dao/BookmarkDAO");
const Bookmark = require("../model/Bookmark");
const jwt = require('jsonwebtoken');


router.get('/', async (req, res, next) => {
  try {
    const bookmarks = await BookmarkDAO.select();
    res.status(200).json(bookmarks);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.sendStatus(500);
    next(err);
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

router.post('/', async (req, res, next) => {
  try {
    const bookmark = req.body;
    await BookmarkDAO.insert(bookmark);
    res.status(201).send(true);
  } catch (err) {
    console.error("Error in POST /:", err);
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const params = req.params;
    const body = req.body;

    const bookmark = new Bookmark({
      id: params.id,
      firstTitle: body.firstTitle,
      secondTitle: body.secondTitle,
      url: body.url,
      comment: body.comment
    })

    await BookmarkDAO.update(bookmark);
    res.status(200).send(true);
  } catch (err) {
    console.error("Error in PUT /:id:", err);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await BookmarkDAO.deleteByID(id);
    res.status(200).send(true);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.status(500).send("Error occurred while deleting bookmark.");
  }
});

module.exports = router;