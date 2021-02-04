const mongoose = require("mongoose");

const { Schema } = mongoose;

const regulation = new Schema(
  {
    type: String,
    properties: Object,
    geometry: Object,
  },
  { collection: "meter" }
);

const LogEntry = mongoose.model("nycReg", regulation);

module.exports = LogEntry;
