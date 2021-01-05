  import mongoose from 'mongoose';
  const {
      Schema
  } = mongoose;

  const requiredString = {
      type: String,
      required: true
  };
  const requiredNumber = {
      type: Number,
      required: true
  };
  //   const defaultRequiredDate = {
  //       type: Date,
  //       default: Date.now,
  //       required: true
  //   };

  const logEntrySchema = new Schema({
      Title = requiredString,
      images: String,
      description: String,
      comments: String,
      Latitude = {
          ...requiredNumber,
          max: 180,
          min: -180
      },
      Longitude = {
          ...requiredNumber,
          max: 90,
          min: -90
      },
      rating: {
          type: Number,
          min: 0,
          max: 10,
          default: 0
      },
      visitDate = {
          type: Date,
          required: true
      }
  }, {
      timestamps: true
  });


  const LogEntry = mongoose.model('LogEntry', logEntrySchema);

  module.exports = LogEntry;