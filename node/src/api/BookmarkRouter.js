import express from 'express';
import BookmarkDAO from "../dao/BookmarkDAO.js";
import Bookmark from "../model/Bookmark.js";
import JWT from "../logic/JWT.js";

const router = express.Router();

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

router.post('/', async (req, res, next) => {
  try {
    const bookmark = req.body;
    await BookmarkDAO.insert(bookmark);
    res.sendStatus(201);
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
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in PUT /:id:", err);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await BookmarkDAO.deleteByID(id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.sendStatus(500);
  }
});

export default router;