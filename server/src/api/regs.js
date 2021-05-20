const { Router } = require("express");

const regs = require("../models/regs");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const entries = await regs.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const regs = new regs(req.body);
    const createEntry = await regs.save();
    res.json(createEntry);
  } catch (error) {
    if (error === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
  console.log(req.body);
});

module.exports = router;
