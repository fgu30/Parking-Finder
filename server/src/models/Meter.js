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

const Meter = mongoose.model("NycMeter", nycmeter);

module.exports = Meter;
