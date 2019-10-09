const mongoose = require("mongoose");
const { Schema } = mongoose;

const project = new Schema({
  name: {
    type: String,
    require: true
  },
  description: {
    type: String
  },
  link: {
    type: String
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
});

module.exports = mongoose.model("project", project);
