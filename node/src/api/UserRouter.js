const express = require('express');
const router = express.Router();
const UserDAO = require("../dao/UserDAO");

const jwt = require('jsonwebtoken');


router.post('/sign-in', async (req, res) => {
  try {
    let data = req.body;
    let result = await UserDAO.SelectByUsernamePassword(data);

    // Judge if data.username and data.password match
    if (result.length > 0) {
      // Generate token
      const token = jwt.sign({sub: data.username}, process.env.JWT_SECRET, {expiresIn: '144h'});
      res.status(200).json({token});
    } else {
      res.status(401).send("Invalid Username or Password");
    }
  } catch (err) {
    console.error("Error in POST /sign-in:", err);
    res.sendStatus(500);
  }
});

router.post('/sign-up', async (req, res) => {
  try {
    let data = req.body;
    let sqlData = {username: data.username};

    // Judge if data.username exists
    let result = await UserDAO.SelectByUsername(sqlData);
    if (result.length > 0) {
      res.status(409).send("Username already exists");
    } else {
      // Store Data
      await UserDAO.Insert(data);
      res.sendStatus(200);
    }
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

  try {
    req.username = jwt.verify(token, process.env.JWT_SECRET).sub;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
});

router.get('/credit', async (req, res) => {
  try {
    let result = await UserDAO.SelectCreditByUsername({
      username: req.username
    });
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error in GET /credit:", err);
    res.sendStatus(500);
  }
});

// Do not expose credit update API to the frontend!

router.put('/', async (req, res) => {
  try {
    let data = req.body;

    // Get current user data
    let current_user = await UserDAO.SelectByUsername({username: req.username});
    let potential_new_user = await UserDAO.SelectByUsername({username: data.username});

    // Judge if the username is changed but already exists
    if (data.username != req.username && potential_new_user.length > 0) {
      res.status(409).send("Username already exists");
    }

    // Update Data
    let updateSqlData = {id: current_user[0].id, username: data.username, password: data.password};
    await UserDAO.Update(updateSqlData);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in PUT /:", err);
    res.sendStatus(500);
  }

});

router.delete('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    await UserDAO.Delete(id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.sendStatus(500);
  }
});

module.exports = router;