const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = new Schema({
  fname: {
    type: String,
    require: true
  },
  lname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    uniquie: true
  },
  password: {
    type: String,
    require: true
  },
  program: {
    type: String,
    require: true
  },
  batch: {
    type: String,
    require: true
  },
  imageLink: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("user", user);
