const { Router } = require("express");

const meters = require("../models/meters");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const entries = await meters.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
