const express = require('express');
const router = express.Router();
const UserDAO = require("../dao/UserDAO");
const JWT = require("../logic/JWT");


router.get('/', async (req, res) => {

  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(401);
  }

  const username = await JWT.getUsernameFromToken(token);
  if (!username) {
    return res.sendStatus(403);
  }
  res.status(200).json({username: username});
});

router.post('/sign-in', async (req, res) => {
  try {
    const data = req.body;

    const result = await UserDAO.selectByUsernamePassword(data.username, data.password);

    if (result.length === 0) {
      return res.sendStatus(401);
    }

    const token = await JWT.getTokenFromUsername(data.username);
    res.status(200).json({token: token});
  } catch (err) {
    console.error("Error in POST /sign-in:", err);
    res.sendStatus(500);
  }
});

router.post('/sign-up', async (req, res) => {
  try {
    const data = req.body;

    if (await UserDAO.selectIdByUsername(data.username)) {
      return res.sendStatus(409);
    }

    await UserDAO.insert(data.username, data.password);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in POST /sign-up:", err);
    res.sendStatus(500);
  }
});

router.use(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(401);
  }

  const username = await JWT.getUsernameFromToken(token);
  if (!username) {
    return res.sendStatus(403);
  }
  req.username = username;
  next();
});

router.get('/credit', async (req, res) => {
  try {
    const credit = await UserDAO.selectCreditByUsername(req.username);
    res.status(200).json({credit: credit});
  } catch (err) {
    console.error("Error in GET /credit:", err);
    res.sendStatus(500);
  }
});

router.put('/', async (req, res) => {
  try {
    const data = req.body;

    // Judge if the username is changed but already exists
    if (data.username !== req.username && await UserDAO.selectIdByUsername(data.username)) {
      return res.sendStatus(409);
    }

    const id = await UserDAO.selectIdByUsername(req.username);
    await UserDAO.update(id, data.username, data.password);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in PUT /:", err);
    res.sendStatus(500);
  }

});

router.delete('/', async (req, res) => {
  try {
    await UserDAO.deleteByUsername(req.username);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.sendStatus(500);
  }
});

module.exports = router;