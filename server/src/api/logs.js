const {
  Router,
} = require('express');

const LogEntry = require('../models/LogEntry');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const logEntry = new LogEntry(req.body);
    const createEntry = await logEntry.save();
    res.json(createEntry);
  } catch (error) {
    if (error === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
  console.log(req.body);
});

module.exports = router;