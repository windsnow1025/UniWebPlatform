const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");


router.get('/', async (req, res) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const username = await jwt.verify(token, global.JWT_SECRET).sub;
    res.status(200).send(username);
  } catch {
    res.sendStatus(403);
  }
});

module.exports = router;