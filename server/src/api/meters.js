const { Router } = require("express");

const Meter = require("../models/Meter");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const entries = await Meter.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
