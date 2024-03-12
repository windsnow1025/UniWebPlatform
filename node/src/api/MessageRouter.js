import express from 'express';
import MessageDAO from "../dao/MessageDAO.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await MessageDAO.selectAll();
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in GET /:", err);
    res.sendStatus(500);
  }
})

router.post('/', async (req, res) => {
  try {
    const message = req.body;
    await MessageDAO.insert(message);
    res.sendStatus(201);
  } catch (err) {
    console.error("Error in POST /:", err);
    res.sendStatus(500);
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const param = req.params;
    await MessageDAO.deleteById(param.id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:id:", err);
    res.sendStatus(500);
  }
})

router.delete('/', async (req, res) => {
  try {
    await MessageDAO.deleteAll();
    res.sendStatus(200);
  } catch (err) {
    console.error("Error in DELETE /:", err);
    res.sendStatus(500);
  }
})

export default router;