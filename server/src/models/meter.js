const mongoose = require("mongoose");

const { Schema } = mongoose;

const nycmeter = new Schema(
  {
    type: String,
    properties: Object,
    geometry: Object,
  },
  { collection: "meter" }
);

const meters = mongoose.model("nycMeter", nycmeter);

module.exports = meters;
