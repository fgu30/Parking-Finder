const mongoose = require("mongoose");

const { Schema } = mongoose;

const regulation = new Schema(
  {
    type: String,
    properties: Object,
    geometry: Object,
  },
  { collection: "regs" }
);

const regs = mongoose.model("nycRegs", regulation);

module.exports = regs;
