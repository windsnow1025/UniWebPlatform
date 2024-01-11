const express = require('express');
const router = express.Router();
const ConversationDAO = require("../dao/ConversationDAO");
const UserDAO = require("../dao/UserDAO");
const Conversation = require("../model/Conversation");
const jwt = require('jsonwebtoken');


router.use(async (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    // Get username from token
    const username = await jwt.verify(token, process.env.JWT_SECRET).sub;

    // Get user_id from username
    const userResult = await UserDAO.SelectByUsername({username: username});
    const user = userResult[0];

    // Set req.user_id
    req.user_id = user.id;
    next();
  } catch (err) {
    res.sendStatus(403);
  }

});

router.get('/', async (req, res) => {
  try {
    const conversations = await ConversationDAO.select(req.user_id);
    res.status(200).json(conversations);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.status(500).send("Error occurred while fetching conversations.");
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
    res.status(201).send(true);
  } catch (err) {
    console.error("Error in POST /:", err);
    res.status(500).send("Error occurred while storing conversation.");
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
    res.status(200).send(true);
  } catch (err) {
    console.error("Error in PUT /:", err);
    res.status(500).send("Error occurred while updating conversation.");
  }
});

router.put('/name', async (req, res) => {
  try {
    let data = req.body;
    let name = data.name;
    let id = data.id;

    let sqlData = {
      user_id: req.user_id,
      name: name,
      id: id
    }

    await ConversationDAO.updateName(sqlData);
    res.status(200).send(true);
  } catch (err) {
    console.error("Error in PUT /name:", err);
    res.status(500).send("Error occurred while updating conversation.");
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const params = req.params;

    await ConversationDAO.deleteById(req.user_id, params.id);
    res.status(200).send(true);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.status(500).send("Error occurred while deleting conversation.");
  }
});

module.exports = router;