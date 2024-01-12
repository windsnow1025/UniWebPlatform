const express = require('express');
const router = express.Router();
const ConversationDAO = require("../dao/ConversationDAO");
const Conversation = require("../model/Conversation");
const JWT = require("../logic/JWT");


router.use(async (req, res, next) => {

  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(401);
  }

  const userId = await JWT.getUserIdFromToken(token);
  if (!userId) {
    return res.sendStatus(403);
  }
  req.user_id = userId;
  next();
});

router.get('/', async (req, res) => {
  try {
    const conversations = await ConversationDAO.select(req.user_id);
    res.status(200).json(conversations);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;

    const conversation = new Conversation({
      user_id: req.user_id,
      name: data.name,
      conversation: data.conversation
    });

    await ConversationDAO.insert(conversation);
    res.sendStatus(201);
  } catch (err) {
    console.error("Error in POST /:", err);
    res.sendStatus(500);
  }
});

router.put('/', async (req, res) => {
  try {
    const body = req.body;

    const conversation = new Conversation({
      id: body.id,
      user_id: req.user_id,
      name: body.name,
      conversation: body.conversation
    });

    await ConversationDAO.update(conversation);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in PUT /:", err);
    res.sendStatus(500);
  }
});

router.put('/name', async (req, res) => {
  try {
    const data = req.body;

    const conversation = new Conversation({id: data.id, user_id: req.user_id, name: data.name})

    await ConversationDAO.updateName(conversation);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in PUT /name:", err);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const params = req.params;

    await ConversationDAO.deleteById(req.user_id, params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.sendStatus(500);
  }
});

module.exports = router;